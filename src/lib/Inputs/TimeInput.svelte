<script lang="ts">

  import { onMount } from 'svelte';
  import { TimeElement } from 'clock24';
  import { mobile } from '../Stores/CapacitorStore.svelte';

  interface Props { value: string, disabled?: boolean };
  let { value: bindableValue=$bindable(), disabled=false }: Props = $props();

  let timeElement: TimeElement;
  let hourElement: HTMLInputElement;
  let minuteElement: HTMLInputElement;
  let nativeElement: HTMLInputElement;

  onMount(() => {
    timeElement = new TimeElement(hourElement, minuteElement, nativeElement, bindableValue);
    timeElement.subscribe((v) => { bindableValue = v; });
    timeElement.init();
  });

</script>


<!-- TODO: add disabled styling -->
<div class="relative">

  <!-- Visible "fake" input -->
  <button 
    {disabled} 
    class="input pointer-events-none p-0 disabled:border-base-content/15"
  >
    <div class="flex justify-center"> 

      <input
        {disabled}
        type="text"
        maxlength="2"
        inputmode="numeric"
        class="pointer-events-auto w-[31px] text-right select-all"
        bind:this={hourElement}
      >

      <span class="px-1 select-none">:</span>

      <input
        {disabled}
        type="text"
        maxlength="2"
        inputmode="numeric"
        class="pointer-events-auto w-[31px] text-left select-all"
        bind:this={minuteElement}
      >

    </div>
  </button>

  <!-- Hidden actual input used for mobile devices -->
  <input 
    {disabled}
    type="time"
    bind:this={nativeElement}
    class="absolute top-0 left-0 size-full { ($mobile && !disabled) ? 'opacity-0' : 'hidden' }"
  >

</div>