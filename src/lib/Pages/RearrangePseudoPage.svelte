<script lang="ts">

  import type Taskie from '../../db/taskie';
  import { sortable } from '../Utils/sortable';
  import { haptics } from '../Stores/HapticsStore.svelte';

  import ListItemDummy from '../List/ListItemDummy.svelte';
  import RearrangeTopBar from '../TopBar/RearrangeTopBar.svelte';
  

  interface Props { taskiePool: Taskie[], editFlag: boolean, scrollable: HTMLElement|undefined, icon: string };
  let { taskiePool, editFlag = $bindable(), scrollable, icon }: Props = $props();


  // Drag-scroll
  let rafId: number|null = null; // Request animation frame id
  let scrollDistance: number = 0; // Current edge distance
  let scroll: 'none'|'up'|'down' = $state('none'); // State machine
  const SCROLL_ZONE: number = 40; // In px from top/bottom
  const SCROLL_SPEED: number = 6; // Max scroll speed

  $effect(() => {
    if (scroll == 'none') { if (rafId) { cancelAnimationFrame(rafId); } rafId = null; } 
    else { scrollLoop(); }
  });


  function onSorted(_event: any) {
    haptics();
  }
  function updateCopyItems(oid: number, nid: number) {
    const updatedItems = [...taskiePool]; // Shallow copy
    const [movedItem] = updatedItems.splice(oid, 1);
    updatedItems.splice(nid, 0, movedItem);

    taskiePool = updatedItems;
  }

  function onDragMove(event: any) {
    if (!scrollable) { return; }

    const rect: DOMRect = scrollable.getBoundingClientRect();
    const y: number = event.sensorEvent.clientY;

    if (y < rect.top + SCROLL_ZONE) { scroll = 'up'; scrollDistance = rect.top+SCROLL_ZONE-y; }
    else if (y > rect.bottom - SCROLL_ZONE) { scroll = 'down'; scrollDistance = y-rect.bottom+SCROLL_ZONE; }
    else { scroll = 'none'; }
  }
  function onSortableStop(_event: any) {
    scroll = 'none';
  }
  function scrollLoop() {
    if (scroll == 'none') { return; }
    if (!scrollable) { return; }

    const speed: number = Math.min(SCROLL_SPEED, scrollDistance/2);
    if (scroll == 'up') { scrollable.scrollTop -= speed; }
    else { scrollable.scrollTop += speed; }

    rafId = requestAnimationFrame(scrollLoop);
  }
  

  function close() {
    editFlag = false;
  }
  function save() {
    let index: number = 0;
    taskiePool.forEach(t => {
      t.setPosition(index);
      index++;
    });

    close();
  }

</script>


<style>
   :global(.list > div > *) {
    margin-bottom: var(--gap);
  }
  :global(.draggable-source--is-dragging) {
    transform: scaleX(0.98);
    opacity: 0.4;
    transition-property: transform;
  }
  :global(.draggable-mirror) {
    display: none;
    pointer-events: none;
  }
</style>


<div class="flex flex-col size-full overflow-hidden bg-base-200">

  <RearrangeTopBar emoji={'🔀'} title={'Arrange with Yrellis'} onClickClose={close} onClickSave={save}  />

  <div class="overflow-hidden pt-(--gap)">
    <div class="grid size-full md:p-(--md-gap) max-md:ps-[4px] max-md:pe-[2px] force-scroll force-scroll-y" bind:this={scrollable}>
      <div class="justify-self-center max-w-(--list-item-max-w) w-full">
        
        <div
          class="list w-full"
          use:sortable={{onSorted, onSortableStop, onDragMove, onUpdate: updateCopyItems}}
        >
          {#each taskiePool as taskie(taskie.id)}
            <div data-sortable-item data-id={taskie.id}>
              <ListItemDummy {taskie} scaleTransition={true} {icon} />
            </div>
          {/each} 
        </div>
        
      </div>
    </div>
  </div>

</div>