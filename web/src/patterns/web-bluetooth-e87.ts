import { SIZE, HALF, RADIUS, TAU, createCanvas, clear, circularMask, toJpeg, mulberry32 } from './helpers'
import type { PatternOptions } from './helpers'

export async function generateCircularProgress(opts: PatternOptions): Promise<Uint8Array[]> {
  const [canvas, ctx] = createCanvas()
  const frames: Uint8Array[] = []
  const ringWidth = 48
  const colors = ['#ff3366', '#ff9933', '#33ff99']

  for (let f = 0; f < opts.frames; f++) {
    const phase = f / opts.frames
    clear(ctx, '#0a0a14')

    const bg = ctx.createRadialGradient(HALF, HALF, 20, HALF, HALF, RADIUS)
    bg.addColorStop(0, 'rgba(255,255,255,0.04)')
    bg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.arc(HALF, HALF, RADIUS, 0, TAU)
    ctx.fill()

    for (let i = 0; i < 3; i++) {
      const r = RADIUS - i * (ringWidth + 6) - ringWidth / 2 - 1
      const angle = ((phase * (i + 1) + i * 0.2) % 1) * TAU
      const direction = i % 2 === 0 ? 1 : -1

      ctx.beginPath()
      ctx.arc(HALF, HALF, r, 0, TAU)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = ringWidth
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(HALF, HALF, r, -Math.PI / 2, -Math.PI / 2 + angle * direction, direction < 0)
      ctx.strokeStyle = colors[i]
      ctx.lineCap = 'round'
      ctx.stroke()

      const tipAngle = -Math.PI / 2 + angle * direction
      ctx.beginPath()
      ctx.arc(HALF + Math.cos(tipAngle) * r, HALF + Math.sin(tipAngle) * r, ringWidth * 0.42, 0, TAU)
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.fill()
    }

    const pulse = Math.sin(phase * TAU * 3) * 0.3 + 0.7
    const glow = ctx.createRadialGradient(HALF, HALF, 0, HALF, HALF, 62 * pulse)
    glow.addColorStop(0, 'rgba(255,255,255,0.7)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(HALF, HALF, 62 * pulse, 0, TAU)
    ctx.fill()

    frames.push(await toJpeg(canvas, 0.75))
  }
  return frames
}

export async function generateDigitalCircuit(opts: PatternOptions): Promise<Uint8Array[]> {
  const [canvas, ctx] = createCanvas()
  const frames: Uint8Array[] = []
  const rng = mulberry32(999)
  const colors = ['#0ff', '#0af', '#f0f', '#0f6', '#fa0']
  const paths: { points: [number, number][]; color: string; totalLen: number }[] = []

  for (let i = 0; i < 30; i++) {
    const points: [number, number][] = []
    let x = rng() * SIZE
    let y = rng() * SIZE
    points.push([x, y])
    for (let s = 0; s < 8; s++) {
      const len = 20 + rng() * 60
      const dir = Math.floor(rng() * 4)
      if (dir === 0) x += len
      else if (dir === 1) y += len
      else if (dir === 2) x -= len
      else y -= len
      x = Math.max(0, Math.min(SIZE, x))
      y = Math.max(0, Math.min(SIZE, y))
      points.push([x, y])
    }
    const totalLen = points.slice(1).reduce((total, point, j) => {
      const prev = points[j]
      return total + Math.hypot(point[0] - prev[0], point[1] - prev[1])
    }, 0)
    paths.push({ points, color: colors[i % colors.length], totalLen })
  }

  const pointAt = (points: [number, number][], distance: number): [number, number] => {
    let travelled = 0
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1]
      const [x1, y1] = points[i]
      const length = Math.hypot(x1 - x0, y1 - y0)
      if (distance <= travelled + length) {
        const p = length === 0 ? 0 : (distance - travelled) / length
        return [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p]
      }
      travelled += length
    }
    return points[points.length - 1]
  }

  for (let f = 0; f < opts.frames; f++) {
    const phase = f / opts.frames
    clear(ctx, '#050510')

    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.15
    for (const path of paths) {
      ctx.beginPath()
      ctx.strokeStyle = path.color
      path.points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    for (const path of paths) {
      const head = (phase * path.totalLen * 2) % path.totalLen
      for (let t = 10; t >= 0; t--) {
        const [x, y] = pointAt(path.points, (head - t / 10 * 56 + path.totalLen) % path.totalLen)
        const alpha = 1 - t / 11
        const radius = 2 + alpha * 4

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, TAU)
        ctx.fillStyle = `rgba(255,255,255,${0.22 + alpha * 0.75})`
        ctx.fill()

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3.2)
        glow.addColorStop(0, path.color)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.globalAlpha = 0.25 + alpha * 0.55
        ctx.beginPath()
        ctx.arc(x, y, radius * 3.2, 0, TAU)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      for (const [x, y] of path.points) {
        ctx.beginPath()
        ctx.arc(x, y, 4.2, 0, TAU)
        ctx.fillStyle = 'rgba(120,220,255,0.5)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, TAU)
        ctx.fillStyle = 'rgba(220,255,255,0.95)'
        ctx.fill()
      }
    }

    circularMask(ctx)
    frames.push(await toJpeg(canvas, 0.75))
  }
  return frames
}

export async function generateHypnoToad(opts: PatternOptions): Promise<Uint8Array[]> {
  const [canvas, ctx] = createCanvas()
  const frames: Uint8Array[] = []

  for (let f = 0; f < opts.frames; f++) {
    const phase = f / opts.frames
    const t = phase * TAU
    clear(ctx, '#120412')

    const bg = ctx.createRadialGradient(HALF, HALF, 10, HALF, HALF, RADIUS)
    bg.addColorStop(0, 'rgba(110,30,130,0.35)')
    bg.addColorStop(1, 'rgba(0,0,0,0.9)')
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.arc(HALF, HALF, RADIUS, 0, TAU)
    ctx.fill()

    const drawEye = (cx: number, phaseShift: number) => {
      ctx.beginPath()
      ctx.arc(cx, HALF - 8, 86, 0, TAU)
      ctx.fillStyle = '#d8f1a2'
      ctx.fill()

      for (let i = 0; i < 11; i++) {
        const pulse = 0.85 + Math.sin(t * 2.2 + phaseShift + i * 0.6) * 0.12
        const r = 76 * (1 - i / 11) * pulse
        ctx.beginPath()
        ctx.arc(cx, HALF - 8, r, 0, TAU)
        ctx.fillStyle = `hsl(${(300 + i * 18 + phase * 180) % 360},95%,${52 - i * 1.5}%)`
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(cx + Math.cos(t * 3 + phaseShift) * 9, HALF - 8 + Math.sin(t * 2.4 + phaseShift) * 6, 13, 0, TAU)
      ctx.fillStyle = '#070707'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx - 24, HALF - 28, 10, 0, TAU)
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fill()
    }

    drawEye(HALF - 86, 0)
    drawEye(HALF + 86, Math.PI)

    ctx.beginPath()
    ctx.arc(HALF, HALF + 84, 74, 0.08 * Math.PI, 0.92 * Math.PI)
    ctx.lineWidth = 8
    ctx.strokeStyle = 'rgba(120,240,120,0.75)'
    ctx.stroke()
    ctx.lineWidth = 3
    ctx.strokeStyle = `rgba(220,255,220,${0.25 + (0.5 + 0.5 * Math.sin(t * 4)) * 0.35})`
    ctx.stroke()

    circularMask(ctx)
    frames.push(await toJpeg(canvas, 0.75))
  }
  return frames
}

export async function generateEmojiBurst(opts: PatternOptions): Promise<Uint8Array[]> {
  const [canvas, ctx] = createCanvas()
  const frames: Uint8Array[] = []
  const rng = mulberry32(2025)
  const emojis = ['🔥', '⭐', '💜', '🌈', '✨', '🎉', '💎', '🌸', '🚀', '🎶', '💥', '🌀']
  const particles = Array.from({ length: 44 }, () => ({
    angle: rng() * TAU,
    speed: 1.2 + rng() * 0.55,
    offset: rng(),
    emoji: emojis[Math.floor(rng() * emojis.length)],
    spin: (rng() - 0.5) * TAU * 2,
    size: 24 + rng() * 24,
  }))

  for (let f = 0; f < opts.frames; f++) {
    const phase = f / opts.frames
    clear(ctx, '#0a0010')

    const center = ctx.createRadialGradient(HALF, HALF, 0, HALF, HALF, 60)
    center.addColorStop(0, 'rgba(180,100,255,0.3)')
    center.addColorStop(1, 'rgba(180,100,255,0)')
    ctx.fillStyle = center
    ctx.beginPath()
    ctx.arc(HALF, HALF, 60, 0, TAU)
    ctx.fill()

    for (const particle of particles) {
      const t = (phase + particle.offset) % 1
      const distance = (1 - (1 - t) ** 2) * (RADIUS + 42) * particle.speed
      if (distance > RADIUS + 20) continue
      const sizeMul = t < 0.16 ? t / 0.16 : 1 - (t - 0.16) * 0.22
      const size = particle.size * Math.max(0.34, sizeMul) * (0.88 + 0.4 * Math.min(1, distance / RADIUS))

      ctx.save()
      ctx.translate(HALF + Math.cos(particle.angle) * distance, HALF + Math.sin(particle.angle) * distance)
      ctx.rotate(particle.spin * phase)
      ctx.font = `${Math.round(size)}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(particle.emoji, 0, 0)
      ctx.restore()
    }

    frames.push(await toJpeg(canvas, 0.75))
  }
  return frames
}
