<script lang="ts">
  
  import type Taskie from '../../db/taskie';
  import type { Category } from './Category.svelte';

  import { fade } from 'svelte/transition';

  interface Props { category: Category, taskies: Taskie[] };
  let { category, taskies }: Props = $props();

</script>


<div class="sticky max-md:top-0 md:-top-(--md-gap) h-8.5 text-lg z-1" data-list-member>
  <div class="relative flex items-center size-full font-bold bg-secondary px-2 rounded-lg z-1 mdc-elevation--z1">

    <span class="select-none grow">
      {`${category.name}:`}
    </span>

    {#if category.taskies.length == 0 && taskies.length > 0 && category.iconOnClear != ''}
      <div transition:fade={{ delay: 10, duration: 150 }}>
        {category.iconOnClear}
      </div>
    {/if}

  </div>

  <!-- Visibility hack -->
  <!-- <div class="absolute top-0 left-0 w-[105%] h-[50%] bg-black"></div> -->
</div>