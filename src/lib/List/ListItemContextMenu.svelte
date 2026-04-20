<script lang="ts">

  import { ContextMenu } from 'bits-ui';
  import type Taskie from '../../db/taskie';
  import type { Unsubscriber } from 'svelte/store';
  import { onDestroy, type Component, type Snippet } from 'svelte';
  import { contextMenuTaskie, editModalTaskie } from './ListStore.svelte';
  import { getModal, type A11yDialogElement } from '../Modals/AllyModal.svelte';

  import { quadOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import PencilIcon from '~icons/ic/baseline-edit';
  import TrashIcon from '~icons/ic/baseline-delete';
  import PlusIcon from '~icons/ic/baseline-add-circle-outline';


  // @ts-ignore - no idea why it does that
  type Props = ContextMenu.Props & { trigger: Snippet, taskie: Taskie };
	let { trigger, taskie }: Props = $props();

  let menuOpen: boolean = $state(false);
  const unsubscribe: Unsubscriber = contextMenuTaskie.subscribe((t: Taskie|undefined) => {
    if (t && t.id != taskie.id) { menuOpen = false; }
  });


  function onOpenChange() {
    $contextMenuTaskie = taskie;
  }
  function openEditModal() {
    $editModalTaskie = taskie; // Set the taskie
    const element: A11yDialogElement|null = getModal('editTaskieModal');
    if (element) { element.instance?.show(); }
  }
  function openAddModal() {
    const element: A11yDialogElement|null = getModal('addTaskieModal');
    if (element) { element.instance?.show(); }
  }


  onDestroy(() => {
    unsubscribe();
  });

</script>


{#snippet item( Icon: Component, text: string, shortcut: string = "", full: boolean = true)}
  <div class="btn btn-soft flex h-10 select-none p-2">
    <div class="flex items-center" style={full ? "width: 100%;" : ""}>

      <Icon class="p-[2px] mr-2 size-5" />
      
      <span> {text} </span>

      <div class="ml-auto flex items-center gap-px">
        {#each shortcut as button}
          <kbd class="kbd"> {button} </kbd>
        {/each}
      </div>

    </div>
  </div>
{/snippet}


<ContextMenu.Root onOpenChange={onOpenChange} bind:open={menuOpen}>

  <ContextMenu.Trigger>
    {@render trigger()}
  </ContextMenu.Trigger>
    
  <ContextMenu.Portal>
    <ContextMenu.Content
      class="border-glass-card grid gap-[0.3rem] w-[230px] px-1.5 py-1.5 z-5 rounded-lg"
      forceMount
    >

      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <!-- in:fly={{duration:250, y:10, easing:quadOut}} -->
            <div {...props} in:scale={{duration:135, start:0.85, easing:quadOut}} > 

              <ContextMenu.Item onSelect={openEditModal}>
                {@render item( PencilIcon, "Edit", "⌘E" )}
              </ContextMenu.Item>

              <ContextMenu.Item onSelect={openAddModal}>
                {@render item( PlusIcon, "Add", "⌘N" )}
              </ContextMenu.Item>

              <ContextMenu.Separator> <hr class="hr my-[0.15rem] opacity-30"> </ContextMenu.Separator>

              <ContextMenu.Item onSelect={() => { taskie.delete(); }}>
                {@render item( TrashIcon, "Delete", "", false )}
              </ContextMenu.Item>

            </div>
          </div>
        {/if}
      {/snippet}

    </ContextMenu.Content>
  </ContextMenu.Portal>

</ContextMenu.Root>