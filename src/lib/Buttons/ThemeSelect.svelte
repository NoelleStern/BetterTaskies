<script lang="ts">

  import { capitalize } from '../Utils/cases';
  import { isLightTheme, currentLightTheme, currentDarkTheme, Themes } from '../Stores/SettingsStore.svelte';

  interface Props { themes: Themes };
  let { themes }: Props = $props();

</script>


{#snippet options(themes: string[])}
  {#each themes as t}
    <option value={t.toLowerCase()}> {`${capitalize(t)}`}&#160; </option>
  {/each}
{/snippet}


<!-- &#160; is whitespace -->
{#if $isLightTheme.current}
  <select class="select select-primary outline-primary w-min" bind:value={$currentLightTheme.current}>
    {@render options(themes.light)}
  </select>
{:else}
  <select class="select select-primary outline-primary w-min" bind:value={$currentDarkTheme.current}>
    {@render options(themes.dark)}
  </select>
{/if}