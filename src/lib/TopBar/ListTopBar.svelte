<script lang="ts">

  import { tooltip } from '../Utils/tooltip';
  import { m } from '../../paraglide/messages';

  import TopBar from './TopBar.svelte';
  import MenuButton from '../Buttons/MenuButton.svelte';
  import LightSwitch from '../Buttons/LightSwitch.svelte';
  import TopBarEmojiTitle from './TopBarEmojiTitle.svelte';

  import ReorderIcon from '~icons/ic/baseline-edit-note';
  

  interface Props { emoji: string, title: string, editFlag: boolean, animationFlag: boolean };
  let { emoji, title, editFlag=$bindable(), animationFlag }: Props = $props();


  function onClick() {
    if (!animationFlag) {
      editFlag = !editFlag;
    }
  }

</script>


<TopBar>

  {#snippet lead()}
    <MenuButton/>
  {/snippet}

  {#snippet center()}
    <TopBarEmojiTitle {emoji} {title}/>
  {/snippet}

  {#snippet trail()}
    <div class="max-sm:hidden">
      <LightSwitch/>
    </div>
    
    <div {@attach tooltip(m.reorder(), { placement: "bottom-end" })}>
      <button type="button" class="button squishy" onclick={onClick}>
        <ReorderIcon/>
      </button>
    </div>
  {/snippet}

</TopBar>
