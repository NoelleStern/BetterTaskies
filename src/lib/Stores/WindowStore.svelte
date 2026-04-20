<script module lang="ts">

  import { type Readable, readable } from 'svelte/store';

  class WindowSize {
    width: number;
    height: number;

    constructor(width: number = 0, height: number = 0) {
      this.width = width;
      this.height = height;
    }
  }

  export const windowSize: Readable<WindowSize> = readable(new WindowSize(),
    (set) => {
      if (window == undefined) return;

      const update = () => {
        set(new WindowSize(window.innerWidth, window.innerHeight));
      }

      update();
      window.addEventListener('resize', update);
      return () => { window.removeEventListener('resize', update); }
    }
  );

</script>