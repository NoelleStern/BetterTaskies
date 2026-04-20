<script lang="ts">

  import { appLanguage } from '../Stores/SettingsStore.svelte';
  import { languageTags, languageNames } from '../Stores/SettingsStore.svelte';

</script>


<!-- &#160; is whitespace -->
<select class="select select-primary outline-primary w-min" bind:value={$appLanguage.current} >
  {#each languageTags as t, i}
    <option value={t}> {languageNames[i]}&#160; </option>
  {/each}
</select>