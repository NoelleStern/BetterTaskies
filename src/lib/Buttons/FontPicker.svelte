<script lang="ts">

  import { changeEmojiFont } from '../Stores/FontStore.svelte';

  let files: FileList|undefined = $state();
  let file: File|null = $derived((files != undefined) ? files[0] : null);

  $effect(() => {
    if (file) { changeEmojiFont(file); }
  });

</script>


<input 
  type="file" 
  accept=".otf, .ttf, .woff, .woff2" 
  class="file-input file-input-primary outline-primary" 
  bind:files
/> 