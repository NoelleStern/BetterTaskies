<script module lang="ts">

  import { get } from 'svelte/store';
  import { isMobile } from '../Stores/CapacitorStore.svelte';
  import { advancedToggle } from '../Sidebar/SidebarStore.svelte';
  import { goto as basicGoto, type RouteConfig } from '@mateothegreat/svelte5-router';

  import ListPrePage from './ListPrePage.svelte';
  import SettingsPage from './SettingsPage.svelte';

  const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/$/, '');


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

  export function goto(href: string) {
    basicGoto(`${BASE_URL}/${href}`);
  }

  export function sideGoTo(href: string) {
    if (isMobile()) { get(advancedToggle)(false); }
    goto(href);
  }

</script>