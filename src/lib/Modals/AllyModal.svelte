<script module lang="ts">

  import A11yDialog from 'a11y-dialog';

  export type YrellisModal = 'addTaskieModal'|'editTaskieModal';
  export interface A11yDialogElement extends HTMLDivElement { instance?: A11yDialog; }

  export function getModal(id: YrellisModal): A11yDialogElement|null {
    return document.getElementById(id) as A11yDialogElement|null;
  }

</script>


<script lang="ts">

  import { onMount, type Snippet } from 'svelte';
  import { fitText } from '../Utils/FitText.svelte';

  interface Props { 
    title: string
    rootElement?: A11yDialogElement
    dialog?: A11yDialog
    content: Snippet
    quitOnOverlayClick?: boolean
    id?: YrellisModal
  };
  let { 
    title,
    rootElement = $bindable(),
    dialog = $bindable(),
    content,
    quitOnOverlayClick = true,
    id
  }: Props = $props();

  onMount(() => {
    dialog = new A11yDialog(rootElement!);
    rootElement!.instance = dialog;
  });

</script>


<style>
  /*
    1. Make the dialog container, and its child overlay spread across
      the entire window.
  */
  .dialog-container,
  .dialog-overlay {
    position: fixed; /* 1 */
    inset: 0; /* 1 */
  }

  /*
    1. Make sure the dialog container and all its descendants sits on
      top of the rest of the page.
    2. Make the dialog container a flex container to easily center the
      dialog.
  */
  .dialog-container {
    z-index: var(--modal-z-index); /* 1 */
    display: flex; /* 2 */
  }

  /*
    1. Make sure the dialog container and all its descendants are not
      visible and not focusable when it is hidden.
  */
  .dialog-container[aria-hidden='true'] {
    display: none; /* 1 */
  }


  /*
    1. Vertically and horizontally center the dialog in the page.
    2. Make sure the dialog sits on top of the overlay.
    3. Make sure the dialog has an opaque background.
  */
  .dialog-content {
    margin: auto; /* 1 */
    z-index: var(--modal-z-index); /* 2 */
    position: relative; /* 2 */
  }
</style>


<!-- 1. The dialog container -->
<div
  id={id}
  class="dialog-container"
  aria-hidden="true"
  bind:this={rootElement}
>

  <!-- 2. The dialog overlay -->
  <div class="dialog-overlay bg-black/50" data-a11y-dialog-hide={quitOnOverlayClick ? '' : null}></div>

  <!-- 3. The actual dialog -->
  <div class="dialog-content flex flex-col justify-center border-card text-inherit w-full max-w-[min(90%,570px)] max-h-[90%] lg:min-h-32 p-4 md:p-6" role="document">

    <!-- 4. The close button -->
    <!-- <button type="button" data-a11y-dialog-hide aria-label="Close dialog"></button> -->

    <!-- 5. The dialog title -->
    <h2 use:fitText class="text-base-content/85 font-bold select-none">{title}</h2>

    <!-- 6. Dialog content -->
    {@render content()}
    
  </div>

</div>