<script lang="ts">

  // I made it to ensure ListPage always has a folder available
  
  import ListPage from './ListPage.svelte';
  import type Folder from '../../db/folder';
  import { folderStore } from '../Stores/FoldersStore.svelte';


  let { route } = $props();

  const name: string = $derived(route.result.path.params.name);
  const folder: Folder|undefined = $derived(folderStore.folders.find((e: Folder) => e.getName().toLowerCase() == name));


  // Update currentId via Router
  $effect(() => {
    if (folder) {
      folderStore.currentId = folder.id;
    }
  });

</script>


{#if folder}

  <ListPage {folder} />

{/if}