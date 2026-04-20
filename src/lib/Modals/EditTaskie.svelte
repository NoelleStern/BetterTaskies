<script lang="ts">

  import { untrack } from 'svelte';
  import type Taskie from '../../db/taskie';
  import type A11yDialog from 'a11y-dialog';
  import { m } from '../../paraglide/messages';
  import { TaskieEditData } from '../../db/Taskie.svelte';
  
  import GenericTaskieModal from './GenericTaskieModal.svelte';
    

  interface Props {
    taskie?: Taskie
    dialog?: A11yDialog
  };
  let {
    taskie,
    dialog = $bindable(),
  }: Props = $props();


  let modal: GenericTaskieModal;
  let form: HTMLFormElement|undefined = $state();
  let data: TaskieEditData = $derived(
    taskie
    ? TaskieEditData.fromTaskie(taskie)
    : new TaskieEditData()
  );

  $effect(() => {
    if (taskie) {
      untrack(() => {
        modal.setTextByData(data);
      });
    }
  });


  function close() {
    dialog?.hide();
  }

  async function editTaskie() {
    if (!taskie) { return; }
    return taskie.edit(data);
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (form?.checkValidity()) {
      await editTaskie();
      form?.reset();
      close();
    }
  }

</script>


<GenericTaskieModal
  {onSubmit} 
  id={'editTaskieModal'}
  header={m.editTaskHeader()}
  confirmText={m.createTaskAdd()}
  bind:dialog bind:form bind:data bind:this={modal}
/>