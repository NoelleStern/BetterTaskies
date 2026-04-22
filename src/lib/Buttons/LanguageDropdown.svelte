<script lang="ts">

  import { appLanguage } from '../Stores/SettingsStore.svelte';
  import { languageTags, languageNames, getFullAppLanguage} from '../Stores/SettingsStore.svelte';

  let radio: HTMLUListElement;
  let fullLanguageName: string = $derived(getFullAppLanguage());
  $effect(() => { checkLanguage(); }); // Magic that triggers on every fullLanguageName update

  function onChange() {
    const el = radio.querySelector<HTMLInputElement>('input:checked');
    if (el) { $appLanguage.current = el.value; }
  }

  function checkLanguage() {
    const current = radio.querySelector<HTMLInputElement>(`input[aria-label=${fullLanguageName}]`);
    if (current) { current.checked = true; }
  }

</script>


{#snippet item(name: string, value: string)}
  <li>
    <input
      type="radio"
      name="language-dropdown"
      class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
      aria-label={name}
      value={value} />
  </li>
{/snippet}


<div class="dropdown" onchange={onChange}>
  <!-- &#160; is whitespace -->
  <div tabindex="0" role="button" class="select select-primary select-none outline-primary w-min">
    {fullLanguageName}&#160;
  </div>
  <ul role="radiogroup" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl" bind:this={radio}>
    {#each languageTags as t, i}
      {@render item(languageNames[i], t)}
    {/each}
  </ul>
</div>