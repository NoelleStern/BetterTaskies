<script lang="ts">

  import { onMount } from 'svelte';
  import type A11yDialog from "a11y-dialog";
  import AllyModal from "./AllyModal.svelte";
  import { tooltip } from '../Utils/tooltip';
  import { m } from "../../paraglide/messages";
  import { YrellisIntersection } from "../Utils/Yrellis.svelte";
  import type { YrellisIcon } from "../Stores/SettingsStore.svelte";

  interface Props {
    dialog: A11yDialog,
    yrellis: YrellisIcon
  };
  let {
    dialog = $bindable(),
    yrellis = $bindable(),
  }: Props = $props();
  
  let form: HTMLFormElement|undefined = $state();
  let temporaryYrellis: string = $state(yrellis.sticker.name);

  function close() {
    dialog?.hide();
  }

  function updateYrellis() {
    yrellis.icon = temporaryYrellis;
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (form?.checkValidity()) {
      updateYrellis();
      form?.reset();
      close();
    }
  }

  onMount(() => {
    // Reset
    dialog.on('hide', () => {
      temporaryYrellis = yrellis.sticker.name;
    });

    if (form) { form.onsubmit = onSubmit; }
  });

</script>


<style>
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(68px, 1fr));
  }
</style>


<AllyModal title={m.pickStickerHeader()} bind:dialog>
  {#snippet content()}
    <form class="flex flex-col grow gap-3 text-xl overflow-hidden p-1" bind:this={form}>

      <div class="h-0"></div>

      <div tabindex="-1" class="w-full grid-container grid gap-x-5 gap-y-2 force-scroll force-scroll-y">
        {#each YrellisIntersection.all as [_name, combined]}
          <button
            type="button"
            style:background-color={combined.sticker.name == temporaryYrellis ? "var(--color-secondary)" : "transparent" }
            class="size-17 p-1 touch-pan-y squishy border-secondary outline-primary outline-offset-2 rounded-sm focus-visible:outline-2 "
            {@attach tooltip(combined.sticker.fullName, { placement: "bottom", zIndex: 1001, offset: [0, 11] })}
            onclick={() => {temporaryYrellis = combined.sticker.name }}
          >
            <div class="size-full flex justify-center">
              <img alt="Yrellis" draggable="false" class="object-contain" src={combined.sticker.path}/>
            </div>
          </button>
        {/each}
      </div>

      <div class="flex gap-2">
        <div class="w-full"></div>
        <button type="button" class="btn btn-secondary" onclick={close}> {m.back()} </button>
        <button type="submit" class="btn btn-primary"> {m.submit()} </button>
      </div>

    </form>
  {/snippet}
</AllyModal>