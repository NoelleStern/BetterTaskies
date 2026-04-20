<script lang="ts">

  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import type A11yDialog from 'a11y-dialog';
  import { m } from '../../paraglide/messages';
  import type { TaskieEditData } from '../../db/Taskie.svelte';
  import AllyModal, { type YrellisModal } from './AllyModal.svelte';

  import NumberInput from '../Inputs/NumberInput.svelte';
  import TextInputFormatted from '../Inputs/TextInputFormatted.svelte';
  

  interface Props {
    id: YrellisModal
    header: string
    data: TaskieEditData
    dialog?: A11yDialog
    form?: HTMLFormElement|undefined
    onSubmit?: ((this: GlobalEventHandlers, ev: SubmitEvent) => void)
    showClearButton?: boolean
    confirmText: string
    setText?: ((data: TaskieEditData) => void)
  };
  let {
    id,
    header,
    data = $bindable(),
    dialog = $bindable(),
    form = $bindable(),
    onSubmit,
    showClearButton = false,
    confirmText,
    setText = $bindable(setTextByData)
  }: Props = $props();


  let titleEditor: Editor|undefined = $state();
  let descriptionEditor: Editor|undefined = $state();


  export function setTextByData(data: TaskieEditData) {
    titleEditor?.commands.setContent(data.title);
    descriptionEditor?.commands.setContent(data.description);
  }

  function close() {
    dialog?.hide();
  }

  onMount(() => {
    if (form && onSubmit) { form.onsubmit = onSubmit; }
  });

</script>


<AllyModal title={header} {id} bind:dialog>
  {#snippet content()}
    <form class="flex flex-col gap-3 text-xl" bind:this={form}>

      <div class="h-0"></div>

      <TextInputFormatted
        required={true}
        title={m.createTaskTitle()}
        bind:value={data.title} bind:textEditor={titleEditor} {form}
      />
      
      <TextInputFormatted
        title={m.createTaskDescription()}
        bind:value={data.description} bind:text={data.descriptionText} bind:textEditor={descriptionEditor} {form}
      />

      <div class="h-0"></div>
      <NumberInput title={m.createTaskHowOften()} defaultValue={1} buttonStyle="btn-primary" required={true} min={1} bind:value={data.userRepeatAmount} />
      
      <div class="h-1"></div>

      <div class="flex gap-2">
        {#if showClearButton}
          <button type="button" class="btn btn-secondary" onclick={() => { form?.reset(); }}> {m.clear()} </button>
        {/if}
        <div class="w-full"></div>
        <button type="button" class="btn btn-secondary" onclick={close}> {m.back()} </button>
        <button type="submit" class="btn btn-primary"> {confirmText} </button>
      </div>

    </form>
  {/snippet}
</AllyModal>