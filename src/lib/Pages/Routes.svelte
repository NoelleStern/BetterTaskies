<script module lang="ts">

  import { get } from 'svelte/store';
  import { isMobile } from '../Stores/CapacitorStore.svelte';
  import { advancedToggle } from '../Sidebar/SidebarStore.svelte';
  import { goto, type RouteConfig } from '@mateothegreat/svelte5-router';

  import ListPrePage from './ListPrePage.svelte';
  import SettingsPage from './SettingsPage.svelte';

  
  export const routes: RouteConfig[] = [
    {
      path: "",
      hooks: {
        pre: () => {
          goto('taskies/day');
        }
      }
    },
    {
      path: 'taskies/(?<name>.*)',
      component: ListPrePage,
    },
    {
      path: 'settings',
      component: SettingsPage,
    }
  ];

  export function sideGoTo(href: string) {
    if (isMobile()) { get(advancedToggle)(false); }
    goto(href);
  }

</script>