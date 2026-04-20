<script module lang="ts">

  import type Taskie from '../../db/taskie';
  import { writable, type Writable } from 'svelte/store';
  
  export const editModalTaskie: Writable<Taskie|undefined> = writable<Taskie|undefined>();
  export const contextMenuTaskie: Writable<Taskie|undefined> = writable<Taskie|undefined>();

</script>