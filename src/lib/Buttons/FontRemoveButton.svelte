<script lang="ts">

  import { m } from '../../paraglide/messages';
  import { removeEmojiFont } from '../Stores/FontStore.svelte';

  async function onClick() {
    await removeEmojiFont();
  }

</script>


<button type="button" class="btn btn-secondary" onclick={onClick}> {m.remove()} </button>