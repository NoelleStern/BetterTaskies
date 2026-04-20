<script lang="ts">

  import RoundButton from '../Buttons/RoundButton.svelte';

  import PlusIcon from '~icons/ic/baseline-plus';
  import MinusIcon from '~icons/ic/baseline-minus';


  interface Props { 
    value: number
    title: string
    defaultValue: number
    buttonStyle?: string
    required?: boolean
    step?: number
    min?: number
    max?: number 
  };
  let {
    value=$bindable(), 
    title, 
    defaultValue, 
    buttonStyle='',
    required=false, 
    step=1, 
    min, 
    max 
  }: Props = $props();


  function increment(): void {
   if (max == undefined) { value += step }
   else { value = Math.min(max, value+step); } 
  }
  function decrement(): void { 
    if (min == undefined) { value -= step }
    else{ value = Math.max(min, value-step); }
  }

  // https://stackoverflow.com/questions/49923588/input-type-number-with-pattern-0-9-allows-letters-in-firefox
  // function onInput(e: InputEvent & { currentTarget: EventTarget & HTMLInputElement; }) {
  //   const negative: boolean = e.currentTarget.value.startsWith('-');
  //   const stripped = e.currentTarget.value.replace(/[^0-9]/g, '');
  //   if (negative) { value = Number(`-${stripped}`); }
  //   else { value = Number(stripped); }
  // }

</script>


<style>
  @import '@styles/input.css';
</style>


<label class="flex gap-1.5">
  <!-- Title -->
  <div class="select-none whitespace-nowrap">{title}:</div>
  <!-- Number input -->
  <div class="flex grow shrink-1 min-w-0 underline-holder mx-2">
    <input
      class="w-full min-w-0 appearance-none"
      type="number"
      {required}
      {defaultValue}
      min={min != undefined ? `${min}` : ''}
      max={max != undefined ? `${max}` : ''}
      step={step != undefined ? `${step}` : ''}
      bind:value />
    <div class="absolute bottom-0 w-full underline"></div>
  </div>
  <!-- Minus button -->
  <div class="shrink-0">
    <RoundButton {buttonStyle} Icon={MinusIcon} onClick={decrement} type="button"/>
  </div>
  <!-- Plus button -->
  <div class="shrink-0">
    <RoundButton {buttonStyle} Icon={PlusIcon} onClick={increment} type="button"/>
  </div>
</label>