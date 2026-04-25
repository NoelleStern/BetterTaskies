<script module lang="ts">

  import { get } from 'svelte/store';
  import { WebHaptics } from 'web-haptics';
  import { mobile } from './CapacitorStore.svelte';
  import { Haptics, ImpactStyle } from '@capacitor/haptics';

  const wh: WebHaptics = new WebHaptics();

  export function haptics(style: ImpactStyle = ImpactStyle.Light) {
    if (get(mobile)) { Haptics.impact({ style }); }
    else if (WebHaptics.isSupported) { wh.trigger(style.toLowerCase()); } // Should translate well
  }

</script>