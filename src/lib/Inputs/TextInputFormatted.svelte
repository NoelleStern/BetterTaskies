<script lang="ts">

  import StarterKit from '@tiptap/starter-kit';
  import BubbleMenu from '@tiptap/extension-bubble-menu';
  import Placeholder from '@tiptap/extension-placeholder';

  import { onMount, onDestroy } from 'svelte';
  import { Editor, Extension, InputRule } from '@tiptap/core';


  interface Props { 
    value: string,
    text?: string,
    title: string,
    required?: boolean,
    form?: HTMLFormElement|undefined,
    textEditor: Editor|undefined };
  let { 
    value = $bindable(),
    text = $bindable(''),
    title, required=false,
    form,
    textEditor = $bindable()
  }: Props = $props();
  
  
  let onResetInit: boolean = false; // Just in case
  let hiddenInput = $state<HTMLInputElement|undefined>();
  let editorElement = $state<HTMLElement|undefined>();
  let menuElement = $state<HTMLElement|undefined>();

  // TODO: move outta here
  // TODO: add *** support
  const MarkdownLink = Extension.create({
    name: 'markdownLink',
    // Adds markdown-like [text](url) support
    addInputRules() {
      return [
        new InputRule({
          // TODO: review
          find: /\[([^\]]+)\]\(([^)]+)\)\s$/, // Regex for [text](url) + space
          handler: ({ state, range, match }) => {
            const { tr } = state;
            const [_full, label, url] = match;
            
            if (url) {
              tr.replaceWith(range.from, range.to, [
                state.schema.text(label, [
                  state.schema.marks.link.create({ href: url })
                ]),
                state.schema.text(' ') // Preserves the space
              ]);
            }
          },
        })
      ];
    }
  });

  // Add on reset callback
  $effect(() => {
    if (form && !onResetInit) { 
      form.addEventListener('reset', onReset); 
      onResetInit = true; 
    }
  });

  $effect(() => {
    if (hiddenInput) {
      hiddenInput.value = text;
    }
  });

  function onReset() { 
    if (textEditor) {
      textEditor.commands.clearContent(true);
    }
  }

  onMount(() => {
    textEditor = new Editor({
      element: editorElement!,
      extensions: [
        MarkdownLink,
        StarterKit.configure({
          link: {
            openOnClick: false,
            HTMLAttributes: {
              class: 'text-indigo-400 underline cursor-pointer'
            }
          },
          blockquote: false,
          bulletList: false,
          code: false,
          codeBlock: false,
          dropcursor: false,
          gapcursor: false,
          hardBreak: false,
          heading: false,
          horizontalRule: false,
          listItem: false,
          listKeymap: false,
          orderedList: false,
          trailingNode: false
        }),
        Placeholder.configure({
          placeholder: title
        }),
        BubbleMenu.configure({
          element: menuElement!,
          updateDelay: 5,
          options: {
            placement: 'bottom', // TODO: make a setting for it
            strategy: 'fixed',
            onHide: () => {
              menuElement?.setAttribute('data-hidden', '');
            },
            onShow: () => {
              menuElement?.removeAttribute('data-hidden');
            }
          }
        })
      ],
      onCreate({ editor }) {
        if (value == '') { value = editor.getHTML(); }
        else { editor.commands.setContent(value); }
      },
      onUpdate: ({ editor }) => {
        value = editor.getHTML();
        text = editor.getText();
      }
    });
  });

  onDestroy(() => {
    textEditor?.destroy();
  });

</script>


<style>
  @import '@styles/input.css';

  :global(.tiptap:focus) {
    outline: none;
  }

  :global(.tiptap) {
    padding-top: 10px;
    padding-bottom: 3px;
  }

  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    position: absolute;
    color: var(--text-base-content);
    pointer-events: none;
    opacity: 0.5;
    /* transition: opacity 0.2s ease; */
  }
  /* :global(.tiptap:focus p.is-editor-empty:first-child::before) {
    opacity: 0.3;
  } */

  .bubble-menu {
    position: fixed;
    opacity: 0;
    z-index: 1;
	}
  :global(.bubble-menu[data-hidden]) {
    pointer-events: none;
  }
</style>


<div class="underline-holder">
  <!-- Hidden input -->
  <input class="absolute pointer-events-none size-full opacity-0 bottom-0" type="text" {required} bind:this={hiddenInput} />

  <!-- Editor -->
  <div bind:this={editorElement} class="tiptap-editor"></div>
  <div class="absolute bottom-0 w-full h-[0.1rem] underline"></div>

  <!-- Bubble popup -->
  <!-- TODO: move outta here -->
  <div class="bubble-menu join border-primary border-[1px] rounded-lg shadow overflow-hidden" data-hidden bind:this={menuElement} >
    <button class="btn join-item w-12" type="button" onclick={() => textEditor?.chain().focus().toggleBold().run()}> <strong>B</strong> </button>
    <button class="btn join-item w-12" type="button" onclick={() => textEditor?.chain().focus().toggleItalic().run()}>  <em>I</em> </button>
    <button class="btn join-item w-12" type="button" onclick={() => textEditor?.chain().focus().toggleUnderline().run()}> <u>U</u>  </button>
    <button class="btn join-item w-12" type="button" onclick={() => textEditor?.chain().focus().toggleStrike().run()}> <s>S</s> </button>
  </div>
</div>