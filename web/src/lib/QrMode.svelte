<script lang="ts">
  import { t } from './i18n'
  interface Props {
    isWriting: boolean
    qrUrl: string
    qrDarkColor: string
    qrLightColor: string
    qrDotStyle: string
    qrOutsideMode: string
    qrZoom: number
    qrRotation: number
  }

  let {
    isWriting,
    qrUrl = $bindable(),
    qrDarkColor = $bindable(),
    qrLightColor = $bindable(),
    qrDotStyle = $bindable(),
    qrOutsideMode = $bindable(),
    qrZoom = $bindable(),
    qrRotation = $bindable(),
  }: Props = $props()
</script>

<div class="flex flex-col gap-5">
  <label class="flex flex-col gap-2">
    <span class="text-label-md text-on-surface-variant">URL</span>
    <input type="url" inputmode="url" autocomplete="url" spellcheck="false" bind:value={qrUrl} placeholder="https://example.com" disabled={isWriting} />
  </label>

  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-label-md text-on-surface-variant">{$t('Dark modules')}</span>
      <input type="color" bind:value={qrDarkColor} disabled={isWriting} />
    </label>
    <label class="flex flex-col gap-2">
      <span class="text-label-md text-on-surface-variant">{$t('Light modules')}</span>
      <input type="color" bind:value={qrLightColor} disabled={isWriting} />
    </label>
    <label class="flex flex-col gap-2">
      <span class="text-label-md text-on-surface-variant">{$t('Dot style')}</span>
      <select bind:value={qrDotStyle} disabled={isWriting}>
        <option value="square">{$t('Square')}</option>
        <option value="round">{$t('Round')}</option>
        <option value="squircle">{$t('Squircle')}</option>
      </select>
    </label>
    <label class="flex flex-col gap-2">
      <span class="text-label-md text-on-surface-variant">{$t('Outside dots')}</span>
      <select bind:value={qrOutsideMode} disabled={isWriting}>
        <option value="on">{$t('Enabled')}</option>
        <option value="off">{$t('Disabled')}</option>
      </select>
    </label>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <label class="flex flex-col gap-2">
    <span class="text-label-md text-on-surface-variant">{$t('Zoom')} <span class="tabular text-on-surface">{qrZoom.toFixed(2)}×</span></span>
      <input type="range" min="0.85" max="1.45" step="0.01" bind:value={qrZoom} disabled={isWriting} />
    </label>
    <label class="flex flex-col gap-2">
    <span class="text-label-md text-on-surface-variant">{$t('Rotation')} <span class="tabular text-on-surface">{qrRotation.toFixed(0)}°</span></span>
      <input type="range" min="-180" max="180" step="45" bind:value={qrRotation} disabled={isWriting} />
    </label>
  </div>
</div>
