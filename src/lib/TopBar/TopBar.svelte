<script lang="ts">

  import { fitText } from '../Utils/FitText.svelte';
  import { type UnSnippet } from '../Utils/Types.svelte';
  import { mobile } from '../Stores/CapacitorStore.svelte';

  interface Props { lead?: UnSnippet, center?: UnSnippet, trail?: UnSnippet };
  let { lead, center, trail }: Props = $props();

</script>


<header
  style:padding-top={ 'var(--safe-area-top)' }
  style:height={ 
    $mobile
      ? 'calc(var(--safe-area-top) + var(--top-bar-height-mobile))'
      : 'calc(var(--safe-area-top) + var(--top-bar-height))'
  }
  class="grid shrink-0 items-center bg-primary text-primary-content px-4 w-full text-2xl"
>

  <section class="flex min-w-0">

    {#if lead}
      <div class="flex gap-x-2">
        {@render lead()}
      </div>
    {/if}

    {#if center}
      <div use:fitText class="flex min-w-0 items-center justify-center grow font-bold overflow-hidden">
        {@render center()}
      </div>
    {/if}

    {#if trail}
      <div class="flex gap-x-2">
        {@render trail()}
      </div>
    {/if}

  </section>

</header>