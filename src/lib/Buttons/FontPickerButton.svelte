<script lang="ts">

  import { m } from '../../paraglide/messages';
  import { changeEmojiFont } from '../Stores/FontStore.svelte';

  
  let files: FileList|undefined = $state();
  let file: File|null = $derived((files != undefined) ? files[0] : null);

  
  $effect(() => {
    if (file) { changeEmojiFont(file); }
  });

</script>


<!-- Outline fix -->
<style>
  label:focus-within {
    outline-width: 2px;
    outline-style: solid;
    isolation: isolate;
  }
</style>


<label class="relative btn btn-primary overflow-clip">
  {m.pick()}
  <input type="file" class="absolute opacity-0" accept=".otf, .ttf, .woff, .woff2" bind:files/>
</label>