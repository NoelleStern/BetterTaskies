<script lang="ts">

  import type { Component } from 'svelte';
  import type { TT } from '../Utils/tooltip';
  import type { MouseEventHandler } from 'svelte/elements';
  import { tooltip as tooltipAttachment } from '../Utils/tooltip';

  interface Props { 
    size?: string
    elevation?: string
    buttonStyle?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    Icon?: Component
    iconClass?: string
    tooltip?: TT
    type?: "button" | "submit" | "reset" | null | undefined
  };
  let { 
    size='size-8',
    elevation='mdc-elevation--z1',
    buttonStyle='',
    onClick,
    Icon,
    iconClass='size-full',
    tooltip,
    type
  }: Props = $props();

</script>


<button
  type={type}
  class="flex items-center justify-center squishy btn btn-circle {buttonStyle} {elevation} {size}"
  {@attach (tooltip != undefined) && tooltipAttachment(tooltip!.content, tooltip!.props)}
  onclick={onClick}
>
  <Icon class={iconClass}/>
</button>