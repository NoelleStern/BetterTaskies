<script lang="ts">

  import { m } from '../../paraglide/messages';
  import { mobile } from '../Stores/CapacitorStore.svelte';

  import SettingsButton from '../Buttons/SettingsButton.svelte';
  import YrellisGiggle from '@assets/yrellis/stickers/YrellisGiggle.png';

</script>


<style>
  .top-saver {
    height: var(--safe-area-top);
  }
</style>


<div class="px-2 pb-2 w-full bg-primary text-primary-content rounded-br-lg mdc-elevation--z1">

  <!-- Top margin -->
  <div class="top-saver bg-primary"></div>

  <!-- Container -->
  <div class="relative { !$mobile ? 'h-32' : 'h-29' }  size-full flex">

    <!-- Yrellis -->
    <button type="button" tabindex="-1" class="grid { !$mobile ? 'items-center' : '' } shrink-0 h-full squishy">
      <img alt="Yrellis giggle" draggable="false" class="size-25" src={YrellisGiggle}/>
    </button>

    <!-- Cute text -->
    <div class="relative size-full pointer-events-none">
      <div class="absolute ps-2 bottom-0 font-bold">
        {m.drawerTitle().toUpperCase()}
      </div>
    </div>

    <!-- Settings button -->
    <div class="absolute right-1 { !$mobile ? 'top-3' : '' }">
      <SettingsButton/>
    </div>
    
  </div>
  
</div>