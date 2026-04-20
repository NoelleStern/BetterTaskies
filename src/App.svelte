<!--
TODO:
  Custom themes
  Synchronization
  Make squishy feel better on mobile
  * Find a better context menu solution, the delay is killing me
-->


<script lang="ts">

  // Init stores and libs
  import 'dexie';
  import './lib/Stores/SettingsStore.svelte';
  import './lib/Stores/CapacitorStore.svelte';

  // Imports
  import { routes } from './lib/Pages/Routes.svelte';
  import { Router } from '@mateothegreat/svelte5-router';
  import { loadFonts } from './lib/Stores/FontStore.svelte';
  import { startResetTimer } from './lib/Stores/ResetStore.svelte';
  import { scheduleDailyNotificationOnStart } from './lib/Stores/NotificationStore.svelte';
  import { isOpen, isOpenImmediate, advancedToggle } from './lib/Sidebar/SidebarStore.svelte';
  
  // Elements
  import SidebarElement from './lib/Sidebar/SidebarElement.svelte';
  import SidebarContent from './lib/Sidebar/SidebarContent.svelte';

  // Constants
  const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/$/, '');
  
  // Do init stuff
  loadFonts(); // Load fonts
  startResetTimer(); // Start the reset process
  scheduleDailyNotificationOnStart(); // Schedule a daily notification if it wasn't scheduled yet

</script>


<main class="bg-base-200">

  <!-- Sidebar and the rest of the app -->
  <SidebarElement 
    bind:advancedToggle={$advancedToggle} 
    bind:isOpenImmediate={$isOpenImmediate.current} 
    bind:isOpen={$isOpen} 
  >
  
    {#snippet content()}
      <SidebarContent />
    {/snippet}
  
    {#snippet app()}
      {#if routes}
        <Router basePath={BASE_URL} {routes} />
      {/if}
    {/snippet}
    
  </SidebarElement>

</main>