<script lang="ts">

  import type { Placement } from 'tippy.js';
  import { tooltip } from '../Utils/tooltip';
  import { m } from '../../paraglide/messages';
  import { sideGoTo } from '../Pages/Routes.svelte';

  import SettingsIcon from '~icons/ic/baseline-settings';
  
  interface Props { placement?: Placement };
  let { placement='bottom' }: Props = $props();

</script>


<button 
  class="button squishy" type="button"
  onclick={() => { sideGoTo('settings'); }}
  {@attach tooltip(m.tooltipOpenSettings(), { placement: placement })}
>
  <SettingsIcon/>
</button>