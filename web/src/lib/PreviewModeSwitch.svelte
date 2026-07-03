<script lang="ts">
  /**
   * PreviewModeSwitch - wrapper around M3 SegmentedButton for the
   * Live ↔ Preview mode toggle. Public API kept identical to the
   * pre-M3 version so existing call sites work unchanged.
   */
  import SegmentedButton from './m3/SegmentedButton.svelte'
  import { t } from './i18n'

  interface Props {
    mode: 'live' | 'preview'
    disabled?: boolean
  }

  let { mode = $bindable(), disabled = false }: Props = $props()

  const segments = $derived([
    { value: 'live' as const, label: $t('Live'), icon: 'tune' },
    { value: 'preview' as const, label: $t('Preview'), icon: 'play_circle' },
  ])
</script>

<div class:opacity-50={disabled} class:pointer-events-none={disabled}>
  <SegmentedButton {segments} bind:value={mode} name={$t('Preview mode')} />
</div>
