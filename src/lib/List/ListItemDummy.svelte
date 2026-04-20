<script lang="ts">

  import '@styles/strikethrough.css' with { type: 'css' };

  import Taskie from '../../db/taskie';
  import { scale } from 'svelte/transition';
  import { onMount, type Snippet } from 'svelte';


  interface Props { 
    taskie: Taskie,
    overlay?: HTMLElement,
    overlayTransform?: string,
    crossOut?: boolean,
    icon?: string,
    underlay?: Snippet,
    extension?: boolean,
    isOutro?: boolean,
    contextMenu?: Snippet,
    scaleTransition?: boolean
  };
  let {
    taskie,
    overlay = $bindable(),
    overlayTransform = '',
    crossOut = false,
    icon,
    underlay,
    extension = false,
    isOutro = false,
    contextMenu,
    scaleTransition = false
  }: Props = $props();


  let mounted: boolean = $state(false);
  onMount(() => { mounted = true; });

</script>


<style>
  .rounded-mask {
    mask-image: -webkit-radial-gradient(white, black);
  }
  .side-shadow {
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.4);
  }
</style>


<!-- Delay prevents visual glitches -->
<!-- Should both be rounded and shadow has to be on top -->
<div
  class="relative rounded-lg mdc-elevation--z1 select-none" 
>
  <!-- This switch prevents visual bugs when closing -->
  <div class="{isOutro ? "overflow-hidden" : "rounded-mask"} rounded-lg text-xl">
      
    <!-- Underlay slot -->
    <!-- category.underlay provides both color and icon -->
    {#if underlay}
      {@render underlay()}
    {/if}
    
    <!-- Overlay base -->
    <div
      class="relative touch-pan-y side-shadow bg-base-100"
      style:transform={overlayTransform}
      bind:this={overlay}
    >

      <!-- Overlay body -->
      <div class="relative flex pointer-events-none">
        
        <!-- Title and description -->
        <div class="grow px-(--list-item-padding-h) py-6">
          <dt class="font-bold max-w-max" class:strike={crossOut}> {@html taskie.title} </dt>

          <div class="flex gap-1">
            {#if taskie.repeatAmount > 0}
              <dd class="opacity-70 max-w-max" class:strike={crossOut}> 
                <span class="text-accent">{`${taskie.repeatCounter}`}</span><span class="px-px">/</span><span class="text-accent">{`${taskie.repeatAmount+1}`}</span>
              </dd>
            {/if}
            {#if taskie.description != ''}
              <dd class="opacity-70 max-w-max" class:strike={crossOut}> 
                {@html taskie.description} 
              </dd>
            {/if}
          </div>

        </div>

        <!-- Yrellis icon -->
        {#if icon}
          <div class="shrink-0 pe-(--list-item-padding-h) grid place-items-center">
            <button type="button" tabindex="-1" class="pointer-events-auto z-1 squishy">
              {#if scaleTransition}
                {#if mounted} <!-- Doesn't animate properly if isn't mounted -->
                  <img in:scale alt="Yrellis" draggable="false" class="size-15 object-contain" src={icon} />
                {/if}
              {:else}
                <img alt="Yrellis" draggable="false" class="size-15 object-contain" src={icon} />
              {/if}
            </button>
          </div>
        {/if}

      </div>

      <!-- Extension slot -->
      {#if extension}
        <div class="absolute top-0 left-0 w-50 h-full bg-base-100 -translate-x-full"></div>
      {/if}

      <!-- Context menu slot -->
      {#if contextMenu}
        {@render contextMenu()}
      {/if}

    </div>

  </div> 
</div>
