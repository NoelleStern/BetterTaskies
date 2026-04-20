<script lang="ts">

  import { m } from '../../paraglide/messages';
  import { tooltip as tooltipAttachment } from '../Utils/tooltip';

  import AddIcon from '~icons/ic/baseline-add';

  type Props = { onClick: Function };
	let { onClick }: Props = $props();

</script>


<style>
  .bottom-saver {
    --base-height: calc(var(--spacing) * 5);

    position: fixed;
    bottom: calc(var(--safe-area-bottom) + var(--base-height));
    right: var(--base-height);
  }
</style>


<div class="bottom-saver z-1">

  <div {@attach tooltipAttachment(m.tooltipAddTaskie(), { placement: "left" })} class="fab">
    <button class="btn btn-xl btn-circle btn-secondary squishy mdc-elevation--z2" onclick={() => onClick()}>
      <AddIcon />
    </button>
  </div>

</div>