<script lang="ts">

  interface Props { value: string, title: string, required?: boolean };
  let { value=$bindable(), title, required=false }: Props = $props();

</script>


<style>
  @import '@styles/input.css';
</style>


<div class="underline-holder">
  <input
    {required}
    class="w-full"
    type="text"
    placeholder={title}
    bind:value />
  <div class="absolute bottom-0 w-full h-[0.1rem] underline"></div>
</div>