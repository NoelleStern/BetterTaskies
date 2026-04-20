<script lang="ts">

  import '@styles/strikethrough.css' with { type: 'css' };

  import Taskie from '../../db/taskie';
  import { Spring } from 'svelte/motion';
  import { slide } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { Category } from './Category.svelte';
  import { DragGesture } from '@use-gesture/vanilla';
  import { haptics } from '../Stores/HapticsStore.svelte';
  import { mobile } from '../Stores/CapacitorStore.svelte';
  import { taskieCheckHaptics, taskieIncreaseHaptics } from '../Stores/SettingsStore.svelte';

  import ListItemDummy from './ListItemDummy.svelte';
  import ListItemContextMenu from './ListItemContextMenu.svelte';
  

  interface Props { taskie: Taskie, category: Category, onSwipeEnd?: Function};
  let { taskie, category, onSwipeEnd=()=>{} }: Props = $props();

  
  let isOutro: boolean = $state(false); // Fixes visual glitches on mobile

  // svelte-ignore non_reactive_update
  let overlay: HTMLElement;
  let width: number = $state(1000);
  let threshold: number = $derived(Math.max(110, width * 0.15));

  // Swipe
  let swipeGesture: DragGesture;
  const springTiming: number = 220;
  let spring = new Spring(0, { stiffness: 0.1, damping: 0.4 }); // Controls x coordinate
  

  function clamp(value: number) {
    return Math.max(-width, Math.min(0, value));
  }

  function itemHaptics(check: boolean) {
    if (!$mobile) { return; }
    if (check) { if ($taskieCheckHaptics.current) { haptics(); } }
    else { if ($taskieIncreaseHaptics.current) { haptics(); } }
  }
  

  onMount(() => {
    swipeGesture = new DragGesture(
      overlay,
      ({ down, movement: [mx], velocity: [vx], last }) => {
        // Follow finger directly
        if (down) { 
          spring.set(clamp(mx), { instant: true }); 
        }
        else if (last) {
          const triggered = mx < -threshold || (mx < 0 && vx > 0.5); // Threshold or velocity
          spring.set(triggered ? -width : 0); // Set spring

          if (!triggered) { return; }

          if (category.crossOut) {
            setTimeout(() => { onSwipeEnd(taskie); itemHaptics(true); }, springTiming);
          } else {
            if (taskie.repeatCounter < taskie.repeatAmount) { // If repeats
              taskie.incrementRepeatCounter();
              setTimeout(() => { spring.set(0); itemHaptics(false); }, 40);
            } else {
              setTimeout(() => { onSwipeEnd(taskie); itemHaptics(true); }, springTiming);
            }
          }
        }
      },
      {
        axis: "x",
        filterTaps: true
      }
    );
  });
  onDestroy(() => {
    swipeGesture?.destroy();
  });

</script>


<!-- Animated container -->
<div
  bind:clientWidth={width}  
  onoutrostart={() => isOutro=true}
  transition:slide={{ delay: 20, duration: 250 }}
>

  <ListItemDummy 
    {taskie} 
    bind:overlay
    extension={true}
    isOutro={isOutro}
    icon={category.icon}
    scaleTransition={true}
    crossOut={category.crossOut}
    overlayTransform={`translateX(${spring.current}px)`} 
  >

    {#snippet underlay()}
      <div 
        style:border-radius={'calc(var(--radius-lg) + 1px)'}
        class="absolute size-full pointer-events-none {category.underlay.style}" 
      >
        <div class="absolute grid place-items-center h-full right-4">
          <category.underlay.icon class="size-10" />
        </div>
      </div>
    {/snippet}

    {#snippet contextMenu()}
      <ListItemContextMenu taskie={taskie}>
        {#snippet trigger()}
          <div class="absolute size-full -translate-y-[100%]"></div>
        {/snippet}
      </ListItemContextMenu>
    {/snippet}

  </ListItemDummy>

</div>