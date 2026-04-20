<script module lang="ts">

  import { PersistedState } from 'runed';
  import { writable, type Writable } from 'svelte/store';
  import { isMobile } from '../Stores/CapacitorStore.svelte';
  import { PersistedFake, type WritablePersisted } from '../Utils/Types.svelte';


  export const isOpen: Writable<boolean> = writable<boolean>(false);
  export const isOpenImmediate: WritablePersisted<boolean> = initIsOpenImmediate();
  export const advancedToggle: Writable<Function> = writable<Function>();

  
  // On mobile i don't wanna mess with an actual PersistedState
  function initIsOpenImmediate(): WritablePersisted<boolean> {
    if (isMobile()) { return writable<PersistedFake<boolean>>(new PersistedFake(false)); }
    return writable<PersistedState<boolean>>(new PersistedState('SidebarOpen', false));
  }

</script>