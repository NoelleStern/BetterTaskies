<script lang="ts">

  import { tooltip } from '../Utils/tooltip';
  import { m } from '../../paraglide/messages';
  import { isOpenImmediate, advancedToggle } from '../Sidebar/SidebarStore.svelte';

  import MenuIcon from '~icons/ic/baseline-menu';
  import CloseIcon from '~icons/ic/baseline-keyboard-backspace';

  function onClick() {
    $advancedToggle();
  }

</script>


<button
  {@attach tooltip($isOpenImmediate.current ? m.tooltipCloseMenu() : m.tooltipOpenMenu(), { placement: $isOpenImmediate.current ? "bottom" : "bottom-start" })}
  class="swap swap-rotate button squishy { $isOpenImmediate.current ? "swap-active" : "" }"
  onclick={onClick}
>
  <MenuIcon class="swap-off" />
  <CloseIcon class="swap-on" />
</button>