<script module lang="ts">

  import { get } from 'svelte/store';
  import { mobile } from './CapacitorStore.svelte';
  import { Haptics, ImpactStyle } from '@capacitor/haptics';


  export function haptics(style: ImpactStyle = ImpactStyle.Light) {
    if (!get(mobile)) { return; }
    Haptics.impact({ style });
  }

</script>