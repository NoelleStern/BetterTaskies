<script lang="ts">

  import { sideGoTo } from '../Pages/Routes.svelte';

  interface Props { text: string, emoji: string, href: string };
  let { text, emoji, href }: Props = $props();

  function onclick() {
    sideGoTo(href);
  }

</script>


<!-- If not separate buttony, the theme transition breaks -->
<div class="buttony">
  <div
    class="w-[97%] h-12
    bg-base-100 color-base-content
    border-t-1 border-(--color-base-content)/30
    rounded-br-sm text-lg mdc-elevation--z1"
  >

    <button class="size-full focusable text-left ps-2" onclick={onclick}>
      <span class="pe-0.5">{emoji}</span><span>{text}</span>
    </button>

  </div>
</div>