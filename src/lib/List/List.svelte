<script lang="ts">
  
  import Taskie from '../../db/taskie';
  import ListItem from './ListItem.svelte';
  import ListSeparator from './ListSeparator.svelte';
  
  import { Category } from './Category.svelte';


  interface Props { taskiePool: Taskie[], categoryPool: Category[] };
  let { taskiePool, categoryPool }: Props = $props();

  
  function onSwipeEnd(taskie: Taskie) {
    const newState: number = (taskie.state+1) % categoryPool.length;
    taskie.setState(newState);
    taskie.resetRepeatCounter();
    taskie.setCheckTime(Date.now());
  }

</script>


<style>
  :global(.list > div > *) {
    margin-bottom: var(--gap);
  }
</style>


<div class="w-full relative">

  <div class="list w-full overflow-x-hidden">
    {#each categoryPool as category}
    
      <div>

        <!-- Category separator -->
        <ListSeparator {category} taskies={taskiePool} /> 

        <!-- Category items -->
        <!-- Doesn't work without a "key" variable in the parentheses -->
        <!-- https://svelte.dev/docs/svelte/each#Keyed-each-blocks -->
        {#each category.taskies as taskie(taskie.id)}
          <ListItem {taskie} {category} {onSwipeEnd} />
        {/each}
        
      </div>

    {/each}
  </div>

</div>