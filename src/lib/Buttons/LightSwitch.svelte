<script lang="ts">

  import { type Component } from 'svelte';
  import type { Placement } from 'tippy.js';
  import { scale } from 'svelte/transition';
  import { tooltip } from '../Utils/tooltip';
  import { m } from '../../paraglide/messages';
  import { isLightTheme } from '../Stores/SettingsStore.svelte';

  import DarkIcon from '~icons/ic/baseline-dark-mode';
  import LightIcon from '~icons/ic/baseline-light-mode';


  interface Props { placement?: Placement };
  let { placement='bottom' }: Props = $props();


  // svelte-ignore non_reactive_update
  let disabled: boolean = false;
  let animationDuration: number = 150;

  function onChange() {
    if (disabled) { return; }

    $isLightTheme.current = !$isLightTheme.current;

    disabled = true;
    setTimeout(() => { disabled = false; }, animationDuration+10);
  }

</script>


<!-- Wrote it in order to DRY -->
{#snippet icon(Icon: Component)}
  <div 
    class="grid place-items-center size-full absolute squishy"
    transition:scale={{ start:0.5, opacity:0.2, duration:animationDuration }}
  >
    <!-- svelte-ignore attribute_quoted -->
    <Icon class="z-2 pointer-events-none"/>
  </div>
{/snippet}


<!-- Sexy as heck --> 
<!-- There are two button classes for a reason -->
<div class="relative">
  <label>
    
    <!-- Actual input -->
    <!-- z-index for tooltip on hover -->
    <input 
      type="checkbox"
      class="absolute z-1 button appearance-none size-full"
      {@attach tooltip(m.tooltipChangeTheme(), { placement: placement })} 
      placeholder={String($isLightTheme.current)} onchange={onChange}
    >

    <!-- Icon switch -->
    {#if $isLightTheme.current} {@render icon(LightIcon)}
    {:else} {@render icon(DarkIcon)} {/if}

    <!-- Size reference -->
    <div class="button invisible">
      <LightIcon/> 
    </div>

  </label>
</div>