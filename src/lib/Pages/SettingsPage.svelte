<script lang="ts">

  import TimeInput from '../Inputs/TimeInput.svelte';
  import PickSticker from '../Modals/PickSticker.svelte';
  import ThemeSelect from '../Buttons/ThemeSelect.svelte';
  import SettingsTopBar from '../TopBar/SettingsTopBar.svelte';
  import LanguageSelect from '../Buttons/LanguageSelect.svelte';
  import FontPickerButton from '../Buttons/FontPickerButton.svelte';
  import FontRemoveButton from '../Buttons/FontRemoveButton.svelte';

  import type A11yDialog from 'a11y-dialog';
  import { m } from '../../paraglide/messages';
  import { mobile } from '../Stores/CapacitorStore.svelte';
  import { customEmojiFont } from '../Stores/FontStore.svelte';
  import {
    resetTime, dailyTime, persistentNotifications, themes, dailyNotifications,
    yrellisTodoIcon, yrellisDoneIcon, taskieCheckHaptics, taskieIncreaseHaptics
  } from '../Stores/SettingsStore.svelte';

  let todoDialog: A11yDialog;
  let doneDialog: A11yDialog;

</script>


<style>
  .line {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
  }
  .text {
    user-select: none;
  }
  .theme-text {
    user-select: none;
    font-style: italic;
    font-weight: 900;
    letter-spacing: var(--tracking-tight);
  }
  .under-text {
    opacity: 0.6;
    /* https://stackoverflow.com/questions/57464935/font-outline-using-only-css */
    text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
  }
  .rainbow {
    /* https://stackoverflow.com/questions/56418763/creating-the-perfect-rainbow-gradient-in-css */
    background: linear-gradient(
      rgba(255, 0, 0, 1) 20%,
      rgba(255, 255, 0, 1) 40%,
      rgba(0, 192, 255, 1) 60%,
      rgba(192, 0, 255, 1) 80%
    );
    color: transparent;
    background-clip: text;
  }
</style>


<div class="flex flex-col size-full overflow-hidden">

  <!-- Top bar -->
  <SettingsTopBar />

  <div class="flex flex-col gap-5 p-5 force-scroll force-scroll-y">

    <div class="line">
      <div class="text"> {m.language()}: </div>
      <LanguageSelect />
    </div>

    <div class="line">
      <div class="text"> {m.resetTime()}: </div>
      <TimeInput bind:value={$resetTime.value.current} />
    </div>

    {#if $mobile}
      <div class="line">
        <div class="text"> {m.dailyNotifications()}: </div>
        <TimeInput bind:value={$dailyTime.value.current} disabled={!$dailyNotifications.current} />
        <input class="toggle toggle-lg toggle-primary" type="checkbox" bind:checked={$dailyNotifications.current} />
      </div>

      <div class="line">
        <div class="text"> {m.persistentNotifications()}: </div>
        <input class="toggle toggle-lg toggle-primary" type="checkbox" disabled={!$dailyNotifications.current} bind:checked={$persistentNotifications.current} />
      </div>
    {/if}

    {#if $mobile}
      <div class="line">
        <div class="text"> {m.checkHaptics()}: </div>
        <input class="toggle toggle-lg toggle-primary" type="checkbox" bind:checked={$taskieCheckHaptics.current} />
      </div>

      <div class="line">
        <div class="text"> {m.increaseHaptics()}: </div>
        <input class="toggle toggle-lg toggle-primary" type="checkbox" bind:checked={$taskieIncreaseHaptics.current} />
      </div>
    {/if}

    <div class="line">
      <div class="relative">
        <span class="theme-text opacity-0"> {m.theme()} </span><span class="text italic ps-[1px]">:</span>
        <span class="absolute top-0 left-0 theme-text under-text"> {m.theme()} </span>
        <span class="absolute top-0 left-0 theme-text rainbow pe-[2px]"> {m.theme()} </span>
      </div>
      <ThemeSelect {themes} />
    </div>

    <div class="select-none flex gap-4 items-center">
      <div class="line">
        <span class="text"> {m.todoSeparatorTitle()}: </span>
        <button type="button" class="squishy grid justify-center outline-primary outline-offset-2 rounded-sm focus-visible:outline-2" onclick={() => todoDialog.show()}>
          <img alt="ToDo Yrellis" draggable="false" class="size-12 object-contain" src={$yrellisTodoIcon.sticker.path} />
        </button>
      </div>
      <div class="line">
        <span class="text"> {m.doneSeparatorTitle()}: </span>
        <button type="button" class="squishy grid justify-center outline-primary outline-offset-2 rounded-sm focus-visible:outline-2" onclick={() => doneDialog.show()}>
          <img alt="Done Yrellis" draggable="false" class="size-12 object-contain" src={$yrellisDoneIcon.sticker.path} />
        </button>
      </div>
    </div>

    <div class="line">
      <div class="text"> {m.customEmojiFont()}: </div>
      <FontPickerButton/>
      {#if $customEmojiFont.current} <FontRemoveButton/> {/if}
    </div>

    <!-- TODO: implement -->
    <!-- <div class="line">
      <button type="button" class="btn btn-primary"> {m.import()} </button>
      <button type="button" class="btn btn-primary"> {m.share()} </button>
    </div> -->

    <!-- Dialogs -->
    <PickSticker bind:dialog={todoDialog} bind:yrellis={$yrellisTodoIcon} />
    <PickSticker bind:dialog={doneDialog} bind:yrellis={$yrellisDoneIcon}/>

  </div>

</div>