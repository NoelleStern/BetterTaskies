<script module lang="ts">

  import { Capacitor } from '@capacitor/core';
  import { readable, type Readable } from 'svelte/store';

  export const mobile: Readable<boolean> = readable<boolean>(isMobile());
  export const platform: Readable<string> = readable<string>(Capacitor.getPlatform());
  export const native: Readable<boolean> = readable<boolean>(Capacitor.isNativePlatform());

  export function isMobile(): boolean {
    const platform: string = Capacitor.getPlatform();
    return (platform == 'ios' || platform == 'android');
  }

</script>