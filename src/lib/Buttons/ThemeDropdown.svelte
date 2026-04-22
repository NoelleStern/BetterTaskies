<script lang="ts">

  import { capitalize } from '../Utils/cases';
  import { isLightTheme, currentLightTheme, currentDarkTheme, Themes } from '../Stores/SettingsStore.svelte';

  interface Props { themes: Themes };
  let { themes }: Props = $props();

  let radio: HTMLUListElement;
  let themeName: string = $derived($isLightTheme.current ? $currentLightTheme.current : $currentDarkTheme.current);
  $effect(() => { checkTheme(); }); // Magic that triggers on every themeName update

  function onChange() {
    const el = radio.querySelector<HTMLInputElement>('input:checked');
    if (el) { changeTheme(el.value); }
  }

  function changeTheme(theme: string) {
    if (themeName != theme) {
      if ($isLightTheme.current) { $currentLightTheme.current = theme; }
      else { $currentDarkTheme.current = theme; }
    }
  } 

  function checkTheme() {
    const current = radio.querySelector<HTMLInputElement>(`input[value=${themeName}]`);
    if (current) { current.checked = true; }
  }

</script>


{#snippet item(name: string, value: string)}
  <li>
    <input
      type="radio"
      name="theme-dropdown"
      class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
      aria-label={name}
      value={value} />
  </li>
{/snippet}



<div class="dropdown" onchange={onChange}>
  <!-- &#160; is whitespace -->
  <div tabindex="0" role="button" class="select select-primary select-none outline-primary w-min">
    {capitalize(themeName)}&#160;
  </div>
  <ul role="radiogroup" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl" bind:this={radio}>
    {#if $isLightTheme.current}
      {#each themes.light as t }
        {@render item(capitalize(t), t.toLowerCase())}
      {/each}
    {:else}
      {#each themes.dark as t }
        {@render item(capitalize(t), t.toLowerCase())}
      {/each}
    {/if}
  </ul>
</div>