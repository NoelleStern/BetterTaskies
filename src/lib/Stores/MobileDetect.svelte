<script module lang="ts">

  import MobileDetect from 'mobile-detect';
  import { readable, type Readable } from 'svelte/store';
  
  const md = new MobileDetect(window.navigator.userAgent);
  export const mobileDetected: Readable<boolean> = readable<boolean>(md.mobile() != null);

</script>