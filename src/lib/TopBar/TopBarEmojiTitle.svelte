<script lang="ts">

  interface Props { emoji: string, title: string };
  let { emoji, title }: Props = $props();

</script>


<button type="button" tabindex="-1" class="squishy">{emoji}</button><span class="select-none ps-[0.25rem]">{title}</span>