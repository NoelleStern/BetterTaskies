<script lang="ts">

  import type A11yDialog from 'a11y-dialog';
  import { m } from '../../paraglide/messages';
  import { TaskieEditData } from '../../db/Taskie.svelte';
  import { Database, db, type DBResponse } from '../../db/db';
  
  import GenericTaskieModal from './GenericTaskieModal.svelte';
  

  interface Props {
    folderId: number
    dialog?: A11yDialog
  };
  let {
    folderId,
    dialog = $bindable(),
  }: Props = $props();

  function close() {
    dialog?.hide();
  }


  let data: TaskieEditData = $state(new TaskieEditData());
  let form: HTMLFormElement|undefined = $state();

  
  async function addTaskie(): Promise<DBResponse|undefined> {
    const position: number = await db.taskies
      .where('folderId')
      .equals(folderId)
      .count();

    return Database.addTaskie(
      folderId, 
      data.title, 
      data.descriptionText.length > 0 ? data.description : '',
      data.repeatAmount, 0,
      position
    );
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (form?.checkValidity()) {
      await addTaskie();
      form?.reset();
      close();
    }
  }

</script>


<GenericTaskieModal
  {onSubmit}
  id={'addTaskieModal'}
  showClearButton={true}
  confirmText={m.save()}
  header={m.createTaskHeader()}
  bind:data bind:dialog bind:form
/>