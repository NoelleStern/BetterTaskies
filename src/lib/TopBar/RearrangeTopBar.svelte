<script lang="ts">
    
  import { tooltip } from '../Utils/tooltip';
  import { m } from '../../paraglide/messages';
  import type { MouseEventHandler } from 'svelte/elements';
  import { isOpenImmediate } from '../Sidebar/SidebarStore.svelte';

  import TopBar from './TopBar.svelte';
  import TopBarEmojiTitle from './TopBarEmojiTitle.svelte';

  import SaveIcon from '~icons/ic/baseline-save';
  import CloseIcon from '~icons/ic/baseline-close';
  
  interface Props { 
    emoji: string, title: string, 
    onClickClose: MouseEventHandler<HTMLButtonElement>, 
    onClickSave: MouseEventHandler<HTMLButtonElement> 
  };
  let {
    emoji,
    title,
    onClickClose,
    onClickSave 
  }: Props = $props();

</script>


<TopBar>

  {#snippet lead()}
  
    <div {@attach tooltip(m.close(), { placement: $isOpenImmediate.current ? "bottom" : "bottom-start" })}>
      <button type="button" class="button squishy" onclick={onClickClose}>
        <CloseIcon/>
      </button>
    </div>
  {/snippet}

  {#snippet center()}
    <TopBarEmojiTitle {emoji} {title}/>
  {/snippet}

  {#snippet trail()}
    <div {@attach tooltip(m.save(), { placement: "bottom-end" })}>
      <button type="button" class="button squishy" onclick={onClickSave}>
        <SaveIcon/>
      </button>
    </div>
  {/snippet}

</TopBar>
