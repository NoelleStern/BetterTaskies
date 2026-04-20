<script lang="ts">
  
  import { m } from '../../paraglide/messages';

  import TopBar from './TopBar.svelte';
  import MenuButton from '../Buttons/MenuButton.svelte';
  import LightSwitch from '../Buttons/LightSwitch.svelte';
  import TopBarEmojiTitle from "./TopBarEmojiTitle.svelte";

</script>


<TopBar>

  {#snippet lead()}
    <MenuButton/>
  {/snippet}

  {#snippet center()}
    <TopBarEmojiTitle emoji="⚙️" title={m.appTitleSettings()} />
  {/snippet}

  {#snippet trail()}
    <LightSwitch placement='bottom-end'/>
  {/snippet}

</TopBar>
