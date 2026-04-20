<!-- https://uxdesign.cc/developing-the-touch-drawer-weve-all-been-waiting-for-f7fd01527a4 -->
<!-- https://stackoverflow.com/questions/52410124/how-can-i-track-mouse-move-events-in-javascript-once-the-cursor-is-off-of-the-ta -->


<script lang="ts">

  import { onMount } from 'svelte';
  import { Vector } from '../Utils/vector';
  import { animate as anime } from 'animejs';
  import { type UnSnippet } from '../Utils/Types.svelte';
  import { mobile } from '../Stores/CapacitorStore.svelte';


  interface Props {
    useMouse?: boolean,             // Can you swipe with a mouse
    width?: number,                 // Sidebar width
    touchWidth?: number,            // Touch area width
    touchWidthMobile?: number,      // Touch area width for mobile
    openThreshold?: number,         // After which point in relation to the sidebar width should it open once touch ends
    tweenDuration?: number,         // Animation length, in ms
    tweenBackMinDuration?: number,  // Min animation duration when closing the sidebar, in ms
    flickTimeThreshold?:number,     // Max hold time to consider touch a flick
    flickDistanceThreshold?:number, // Min travel distance to consider touch a flick
    
    app?: UnSnippet,                // App content snippet
    content?: UnSnippet,            // Sidebar content snippet
    
    isOpen: boolean,                // Is sidebar fully open, regarding the animation
    isOpenImmediate: boolean,       // Is sidebar considered open, disregarding the animation
    advancedToggle: Function         // Handy toggle function
  };
  let { 
    useMouse = true,
    width = 70,
    touchWidth = 13,
    touchWidthMobile = 9,
    openThreshold = 0.35,
    tweenDuration = 250,
    tweenBackMinDuration = 150,
    flickTimeThreshold = 120,
    flickDistanceThreshold = 8,

    app,
    content,

    isOpen = $bindable(false),
    isOpenImmediate = $bindable(false),
    advancedToggle: advanceToggle = $bindable()
  }: Props = $props();


  let isTouchDown: boolean = $state(false);

  let initialTouch: Vector;
  let touchStartTime: number = 0;
  let currentTouchRaw: Vector = $state( new Vector(0, 0) );
  let currentTouch: Vector = $derived( new Vector(Math.min(Math.max(0, getPixelWidth()), currentTouchRaw.x), currentTouchRaw.y) ); // 0 <= x <= width
  let sidebarProgress: number = $derived(currentTouch.x / getPixelWidth()); // Progress from 0 to 1

  let sidebar: HTMLElement;
  let backdrop: HTMLElement
  let touchArea: HTMLElement;

  type SidebarState = 'stationary'|'moving';
  let fsm: SidebarState = $state('stationary');


  function open() { animate(true); }
  function close() { animate(false); }
  function toggle() { if (isOpen) { close(); } else { open(); } }
  function isPastThreshold(): boolean {
    return sidebarProgress >= openThreshold;
  }
  function isFlick(lastTouch: Vector, timeDiff: number): boolean {
    const xDiff: number = Math.abs(lastTouch.x - initialTouch.x);
    const yDiff: number = Math.abs(lastTouch.y - initialTouch.y);

    return (
      (timeDiff <= flickTimeThreshold) && // Fast
      (xDiff >= flickDistanceThreshold) && // Relatively long
      (lastTouch.x > initialTouch.x) && // Left to right
      (xDiff > yDiff) // Horizontal
    );
  }
  function shouldBeVisible(): boolean {
    return (isTouchDown || fsm == 'moving' || isOpenImmediate);
  }
  function spring(lastTouch: Vector, timeDiff: number) {
    if (isPastThreshold() || isFlick(lastTouch, timeDiff)) { open(); } 
    else { close(); }
  }
  advanceToggle = (value: boolean|undefined) => {
    if (value != null) { animate(value); }
    else { toggle(); }
  }

  function getPixelWidth(): number { return sidebar?.clientWidth || 1; } // 1 instead of 0 for safety
  function animate(finalValue: boolean) {
    if (fsm != 'stationary') { return; }
    
    const pos: any = { x: currentTouch.x };
    const finalX: number = (finalValue) ? getPixelWidth() : 0;
    let actualDuration: number;
    if (finalValue) { actualDuration = tweenDuration * (1-sidebarProgress); }
    else { actualDuration = Math.max(tweenBackMinDuration, tweenDuration * sidebarProgress); }

    fsm = 'moving';
    isOpenImmediate = finalValue;

    anime(
      pos, {
        x: finalX,
        duration: actualDuration,
        easing: "easeInOutQuad",
        onUpdate: () => {
          currentTouchRaw = new Vector(pos.x, currentTouchRaw.y);
        },
        onComplete: () => {
          fsm = 'stationary';
          isOpen = finalValue;
        }
      }
    );
  }
  function immediate(finalValue: boolean) {
    if (fsm != 'stationary') { return; }
    
    const finalX: number = (finalValue) ? getPixelWidth() : 0;
    currentTouchRaw = new Vector(finalX, currentTouchRaw.y);
    isOpenImmediate = finalValue;
    isOpen = finalValue;
  }


  function getTouch(e: TouchEvent|MouseEvent, end: boolean = false): Vector {
    if (e instanceof TouchEvent) {
      let touchObject: Touch;
      if (!end) { touchObject = e.targetTouches[0]; }
      else { touchObject = e.changedTouches[0];  }
      return new Vector(touchObject.pageX, touchObject.pageY);
    } else {
      return new Vector(e.pageX, e.pageY);
    }
  }
  function onStart(e: TouchEvent|MouseEvent) {
    if (fsm != 'stationary' || isOpen) { return; }

    if (e instanceof MouseEvent) {
      if (e.button != 0) { return; }
    }

    const touch: Vector = getTouch(e);
    initialTouch = touch;
    currentTouchRaw = touch;
    touchStartTime = e.timeStamp;

    isTouchDown = true;
  }
  function onEnd(e: TouchEvent|MouseEvent) {
    if (!isTouchDown) { return; }

    const touch: Vector = getTouch(e, true);
    currentTouchRaw = touch;

    const lastTouch: Vector = touch;
    const timeDiff: number =  e.timeStamp-touchStartTime;
    spring(lastTouch, timeDiff);
    
    isTouchDown = false;
  }
  function onMove(e: TouchEvent|MouseEvent) {
    if (!isTouchDown) { return; }
    
    currentTouchRaw = getTouch(e);
  }

  
  onMount(() => {
    // Open if needed, also syncs isOpenImmediate with isOpen
    immediate(isOpenImmediate);

    // Touch swipe
    touchArea.ontouchstart = (e) => { onStart(e) };
    document.ontouchmove = (e) => { onMove(e) };
    document.ontouchend = (e) => { onEnd(e) };

    // Mouse swipe
    if (useMouse) {
      touchArea.onmousedown = (e) => { onStart(e) };
      document.onmousemove = (e) => { onMove(e) };
      document.onmouseup = (e) => { onEnd(e) };
    }

    // Close on click when screen is small
    // Works on both pc and mobile
    backdrop.onclick = () => {
      close();
    }
	});

</script>


<style lang="scss">
  .backdrop {
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    z-index: var(--sidebar-backdrop-z-index);

    /* Turn off pointer events if on PC and screen is big enough */
    @media (pointer:fine) and (width >= 48rem) {
      pointer-events: none;
    }

    /* Mobile style */
    @media (pointer:none), (pointer:coarse), (width < 48rem) {
      background: color-mix(in oklab, var(--color-base-100) calc(var(--sidebar-progress) * 5%), transparent);
      backdrop-filter: blur(calc(var(--sidebar-progress) * 1px));
    }
  }
  
  .top-spacer {
    flex-shrink: 0;
    pointer-events: none;
    height: calc(var(--safe-area-top) + var(--top-bar-height));
  }
</style>


<!-- Container -->
<div
  class="relative min-h-screen"
  style="
    --sidebar-progress: {sidebarProgress};
    --sidebar-width: calc(var(--spacing) * {width});
    --sidebar-position: calc({currentTouch.x}px - var(--sidebar-width));
    --visible-width: calc(var(--sidebar-width) + var(--sidebar-position));
    --touch-area-base-width: calc(var(--spacing) * {$mobile ? touchWidthMobile : touchWidth});
  "
>

  <!-- Backdrop -->
  <div 
    class="backdrop"
    style:visibility={ shouldBeVisible() ? "visible" : "hidden" }
    style:pointer-events={isOpen ? "" : "none"}
    bind:this={backdrop}
  > 
  </div>


  <!-- Sidebar -->
  <div
    class="fixed left-0 top-0 bottom-0 z-(--sidebar-z-index)"
    style:visibility={ shouldBeVisible() ? "visible" : "hidden" }
    style:left="var(--sidebar-position)"
    style:width="var(--sidebar-width)"
    bind:this={sidebar}
  >
    {#if content}
      {@render content()}
    {/if}
  </div>


  <!-- App container -->
  <div class="flex">
  
    <!-- Spacer -->
    <div class="w-(--visible-width) shrink-0 max-md:w-0"></div>
    
    <!-- App -->
    <div class="h-screen w-full">
      {#if app}
        {@render app()}
      {/if}
    </div>

  </div>

  
  <!-- Touch Area -->
  <div class="absolute flex flex-col h-full top-0 left-0 z-(--sidebar-z-index) w-(--touch-area-base-width) pointer-events-none">

    <!-- Spacer -->
    <div class="top-spacer"></div>

    <!-- Area -->
    <div 
      class="grow"
      style:pointer-events={
        // None if open or moving, otherwise - auto
        (isOpen) ? "none" : ((fsm == "moving") ? "none" : "auto")
      }
      bind:this={touchArea}
    >
    </div>
    
  </div>


</div>