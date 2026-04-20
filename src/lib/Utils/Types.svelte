<script module lang="ts">

  import type { Snippet } from 'svelte';
  import type { PersistedState } from 'runed';
  import type { Writable } from 'svelte/store';

  export class PersistedFake<Type> {
    current: Type;
    constructor(value: Type) {
      this.current = value;
    }
  }

  export type UnSnippet = Snippet|undefined;
  export type WritablePersisted<T> = Writable<PersistedState<T>>|Writable<PersistedFake<T>>;

</script>