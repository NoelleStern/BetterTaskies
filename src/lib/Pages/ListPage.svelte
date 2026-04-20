<script lang="ts">
  
  import List from '../List/List.svelte';
  import AddTaskie from '../Modals/AddTaskie.svelte';
  import EditTaskie from '../Modals/EditTaskie.svelte';
  import ListTopBar from '../TopBar/ListTopBar.svelte';
  import RearrangePseudoPage from './RearrangePseudoPage.svelte';
  import FloatingActionButton from '../Buttons/FloatingActionButton.svelte';
  
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import type Taskie from '../../db/taskie';
  import type Folder from '../../db/folder';
  import type A11yDialog from 'a11y-dialog';
  import type { Observable, Subscription } from 'dexie';
  import type { Category } from '../List/Category.svelte';
  import { windowSize } from '../Stores/WindowStore.svelte';
  import { editModalTaskie } from '../List/ListStore.svelte';
  import { YrellisIntersection } from '../Utils/Yrellis.svelte';
  import { createDefaultCategoryPool, createObservable, createSubscription } from '../List/Observable.svelte';


  interface Props { folder: Folder };
  let { folder }: Props = $props();


  // Page setup
  let dialog = $state<A11yDialog|undefined>();
  let editFlag: boolean = $state(false); // Opens rearrangement
  let animationFlag: boolean = $state(false); // Prevents visual glitches
  let scrollable: HTMLElement|undefined = $state(); // Rearrangement list needs it

  // Taskie setup
  let taskiePool: Taskie[] = $state([]);
  let taskiePoolCopy: Taskie[] = $state([]);
  const categoryPool: Category[] = createDefaultCategoryPool();
  // svelte-ignore state_referenced_locally
  const observable: Observable<Taskie[]> = createObservable(folder.id);
  const subscription: Subscription = createSubscription(observable, taskiePool, categoryPool);

  $effect(() => {
    if (editFlag) { updateCopy(); }
  });


  function updateCopy() {
    taskiePoolCopy = [...taskiePool]; // Shallow copy
  }
  
  
  onDestroy(() => {
    subscription.unsubscribe();
  });

</script>


<div class="relative flex flex-col size-full overflow-hidden">

  <!-- Top bar -->
  <ListTopBar emoji={folder.emoji} title={folder.getTitleName()} {animationFlag} bind:editFlag />

  <!-- List -->
  <div class="overflow-hidden pt-(--gap)">
    <div class="grid size-full md:p-(--md-gap) max-md:ps-[4px] max-md:pe-[2px] force-scroll force-scroll-y" bind:this={scrollable}>
      <div class="justify-self-center max-w-(--list-item-max-w) w-full">

        {#key folder.id}
          <List {taskiePool} {categoryPool} />
        {/key}
        
      </div>
    </div>
  </div>

  <!-- Floating Action Button -->
  <FloatingActionButton onClick={() => dialog?.show()} />
  
  <!-- Add taskie modal -->
  <AddTaskie folderId={folder.id} bind:dialog />
  <!-- Edit taskie modal -->
  <EditTaskie taskie={$editModalTaskie} />


  <!-- Rearrangement list -->
  {#if editFlag}
    <div
      class="absolute top-0 left-0 size-full z-10"
      in:fly={{y: $windowSize.height, duration: 380, opacity: 1}}
      out:fly={{y: $windowSize.height, duration: 450, opacity: 1}}
      ontransitionstart={() => {animationFlag=true}} ontransitionend={() => {animationFlag=false}}
    >
      <RearrangePseudoPage taskiePool={taskiePoolCopy} icon={YrellisIntersection.get('YrellisEh')!.sticker.path} {scrollable} bind:editFlag />
    </div>
  {/if}

</div>