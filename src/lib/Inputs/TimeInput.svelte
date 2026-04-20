<script lang="ts">


  // This simple element is actually surprisingly needy
  // I really didn't expect it to take so much code to make it work
  //
  // I have mo idea how it performs on iOS, but I was pretty happy with Android and Web behavior of this solution


  import { onMount } from 'svelte';
  import { mobile } from '../Stores/CapacitorStore.svelte';


  interface Props { value: string, disabled?: boolean };
  let { value: bindableValue=$bindable(), disabled=false }: Props = $props();


  type TimeDouble = 'hh'|'mm';

  class TimeElement {
    hh: DoubleDigit;
    mm: DoubleDigit;
    hhElement: HTMLInputElement|undefined;
    mmElement: HTMLInputElement|undefined;
    syncOut: Function = () => {};

    constructor(
      hhElement: HTMLInputElement|undefined = undefined,
      mmElement: HTMLInputElement|undefined = undefined,
      value: string = '00:00'
    ) {
      this.hh = new DoubleDigit('hh');
      this.mm = new DoubleDigit('mm');
      this.hhElement = hhElement;
      this.mmElement = mmElement;
      this.value = value;
    }

    get value(): string {
      return `${this.hh.value}:${this.mm.value}`;
    }
    set value(value: string) {
      const split: string[] = value.split(':');
      this.hh.resetValue(split[0]);
      this.mm.resetValue(split[1]);
    }

    public getDD(target: HTMLInputElement): DoubleDigit|undefined {
      if (target == this.hhElement) { return this.hh; }
      else if (target == this.mmElement) { return this.mm; }
    }

    // https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
    public validate(value: string = this.value): boolean {
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
    }

    public syncIn(value: string) {
      this.value = value;
    }
  }

  class DoubleDigit {
    private pValue: string = $state(''); // Crucial, beware
    type: TimeDouble;
    inputHistory: number[] = [];

    constructor(
      type: TimeDouble,
      value: string = '00',
    ) {
      this.type = type;
      this.pValue = value;
    }

    public focus() {
      this.inputHistory = [];
    }

    public resetHistory(array: number[] = []) {
      this.inputHistory = array;
    }

    public addToHistory(n: number) {
      this.inputHistory.push(n);
    }

    public backspace() {
      this.resetValue();
    }

    public setDigit(input: number, firstDigit: number = 0) {
      this.pValue = `${firstDigit}${input}`;
    }

    public resetValue(value: string = '--') {
      this.pValue = value;
      this.inputHistory = [];
    }

    get value(): string {
      return this.pValue;
    }
  }

 
  let nativeInput: HTMLInputElement;
  let hourElement: HTMLInputElement;
  let minuteElement: HTMLInputElement;
  let timeElement: TimeElement = $state(new TimeElement());

  
  function onChange(_e: Event) {
    const value: string = nativeInput.value;
    
    if (timeElement.validate(value)) {
      timeElement.value = value;
      timeElement.syncOut();
    } else if (value == '') {
      // I think doing this generally would be an issue, but since
      // this piece of code is only relevant for mobile it should be fine
      timeElement.value = '00:00';
      timeElement.syncOut();
    }
  }

  function onFocus(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
    const dd: DoubleDigit|undefined = timeElement.getDD(e.currentTarget);
    if (!dd) { return; }
    
    e.currentTarget.select();
    dd.focus();
  };

  function onKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
    if (e.key.startsWith('Arrow')) {
      e.preventDefault(); // Stop bubbling
  
      if (e.currentTarget == timeElement.hhElement) {
        if (e.key == 'ArrowRight') { timeElement.mmElement!.focus(); }
      } else {
        if (e.key == 'ArrowLeft') { timeElement.hhElement!.focus(); }
      }
    }
  }

  // Imitates the native element behavior
  function onBeforeInput(e: InputEvent & { currentTarget: EventTarget & HTMLInputElement }) {
    e.preventDefault(); // Stop bubbling

    const dd: DoubleDigit|undefined = timeElement.getDD(e.currentTarget);
    if (!dd) { return; }

    let nextFlag: boolean = false; // If set changes the focus to mmElement
    const inputType: string = e.inputType; // Input type
    const input: number = Number( (e.data || '').replace(/\D/g, '') ); // Remove non-digits
    
    if (inputType == 'deleteContentBackward') { dd.backspace(); }
    else if (inputType == 'insertText') {
    
      if (dd.type == 'hh') { // Hour input

        // The first digit:
        //    1) Put it as is and change focus to next if it's > 2
        // The second digit:
        //    1) If the first digit is <= 1 - put it as is
        //    2) If the first digit is 2 - force the second digit to be within [0,3]
        
        if (dd.inputHistory.length == 0 || dd.inputHistory.length == 2) { // First digit

          if (dd.inputHistory.length == 2) { dd.resetHistory(); } // Reset if was set
          dd.addToHistory(input); 
          dd.setDigit(input);
          if (input > 2) { nextFlag = true; } // Change focus if makes sense

        } else if (dd.inputHistory.length == 1) { // Second digit

          dd.addToHistory(input);
          if (dd.inputHistory[0] <= 1) { dd.setDigit(input, dd.inputHistory[0]); } 
          else if (dd.inputHistory[0] == 2) { dd.setDigit(Math.min(3, input), 2); }
          nextFlag = true; // Change focus unconditionally

        }

      } else { // Minute input

        // The first digit:
        //    1) Put it as is
        // The second digit:
        //    1) If the first digit > 5 then replace value as well as history
        //    2) Otherwise put as is
        
        if (dd.inputHistory.length == 0 || dd.inputHistory.length == 2) { // First digit

          if (dd.inputHistory.length == 2) { dd.resetHistory(); } // Reset if was set
          dd.addToHistory(input);
          dd.setDigit(input);

        } else if (dd.inputHistory.length == 1) { // Second digit

          if (dd.inputHistory[0] > 5) {
            dd.resetHistory([input]);
            dd.setDigit(input);
          } else {
            dd.addToHistory(input);
            dd.setDigit(input, dd.inputHistory[0]);
          }

        }
        
      }
      
    }

    if (e.currentTarget.value != dd.value) {
      e.currentTarget.value = dd.value; // Set value
      if (timeElement.validate()) { timeElement.syncOut(); } // Validate and update
    }
    
    // Change focus / reselect
    if (!nextFlag) { e.currentTarget.select(); }
    else { timeElement.mmElement!.focus(); }
  }

  onMount(() => {
    nativeInput.value = bindableValue; 
    timeElement = new TimeElement(hourElement, minuteElement, bindableValue);
    timeElement.syncOut = () => { bindableValue = timeElement.value; nativeInput.value = timeElement.value; };
  });

</script>


<!-- TODO: add disabled styling -->
<div class="relative">

  <!-- Visible "fake" input -->
  <div class="input input-bordered input-primary outline-primary disabled:border-primary disabled:opacity-30 p-0">
    <div class="flex justify-center">

      <input
        {disabled}
        type="text"
        maxlength="2"
        inputmode="numeric"
        class="w-[31px] text-right select-all"
        onfocus={onFocus} onkeydown={onKeyDown} onbeforeinput={onBeforeInput} value={timeElement.hh.value}
        bind:this={hourElement}
      >

      <span class="px-1 select-none">:</span>

      <input
        {disabled}
        type="text"
        maxlength="2"
        inputmode="numeric"
        class="w-[31px] text-left select-all"
        onfocus={onFocus} onkeydown={onKeyDown} onbeforeinput={onBeforeInput} value={timeElement.mm.value}
        bind:this={minuteElement}
      >

    </div>
  </div>

  <!-- Hidden actual input used for mobile devices -->
  <input 
    type="time"
    onchange={onChange}
    bind:this={nativeInput}
    class="absolute top-0 left-0 size-full { $mobile ? 'opacity-0' : 'hidden' }"
  >

</div>