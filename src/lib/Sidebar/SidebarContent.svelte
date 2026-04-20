<script lang="ts">
  
  import { m } from '../../paraglide/messages';
  import { folderStore } from '../Stores/FoldersStore.svelte';

  import TopFold from './TopFold.svelte';
  import SidebarTab from './SidebarTab.svelte';

</script>


<style>
  .container {
    z-index: inherit;
  } 
  :global(.container > *) {
    z-index: inherit;
  }
  .tabs {
    width: 100%;
    flex-grow: 1;
    flex-wrap: nowrap;
    flex-direction: column;
    margin-top: var(--gap);
  }
  :global(.tabs > *) {
    margin-bottom: var(--gap);
  }
  .bottom-saver {
    height: var(--safe-area-bottom);
  }
</style>


<div class="relative container flex flex-col size-full bg-base-100">

  <!-- Right border, took a while to figure out -->
  <div class="absolute size-full border-r-1 border-(--color-base-content)/15"></div>

  <!-- Top fold -->
  <TopFold/>

  <div class="flex flex-col grow overflow-y-auto pe-[2px]">
    <div class="flex flex-col grow force-scroll force-scroll-y">

      <!-- Tabs -->
      <div class="tabs">
        {#each folderStore.folders as f}
          <SidebarTab text={f.getTabName()} emoji={f.emoji} href={f.getTabHref()} />
        {/each}
      </div>

      <!-- Authors -->
      <div class="ps-2 pb-1 text-sm opacity-70 select-none">
        <div> {m.credits1()}: <a class="hyperlink" target="_blank" href="https://x.com/NoelleSternchen">{m.noelle()}</a> </div>
        <div> {m.credits2()}: <a class="hyperlink" target="_blank" href="https://x.com/therequiell">{m.requiell()}</a> </div>
        <div> {m.credits3()}: <a class="hyperlink" target="_blank" href="https://x.com/therequiell">{m.requiell()}</a> </div>
      </div>
      
    </div>

    <!-- Bottom margin -->
    <div class="bottom-saver"></div>
  </div>

</div>