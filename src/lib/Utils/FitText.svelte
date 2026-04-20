<script module lang="ts">
  
  function setFontSize(el: HTMLElement, value: number) {
    el.style.fontSize = `${value}px`;
  }

  function performFitText(el: HTMLElement, maxFont: number, minFont: number = 10) {
    let fontSize: number = parseFloat(getComputedStyle(el).fontSize);

    if (el.scrollWidth > el.clientWidth) {
      while (el.scrollWidth > el.clientWidth && fontSize > minFont) {
        fontSize -= 1;
        setFontSize(el, fontSize);
      }
    } else if (el.scrollWidth == el.clientWidth) {
      while (el.scrollWidth == el.clientWidth && fontSize < maxFont) {
        fontSize += 1;
        setFontSize(el, fontSize);
      }
      
      fontSize -= 1;
      setFontSize(el, fontSize);
    }
  }

  export function fitText(
    el: HTMLElement
  ) {
    el.classList.add('fit-text');
    const initialSize: number = parseFloat(getComputedStyle(el).fontSize);

    performFitText(el, initialSize);
    const fun = () => { performFitText(el, initialSize); }

    // Resize observer is crucial to making it mega responsive
    const resizeObserver: ResizeObserver = new ResizeObserver(() => {
      const rect: DOMRect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) { fun(); }
    });

    resizeObserver.observe(el);
    
    return {
      destroy() {
        el.classList.remove('fit-text');
        resizeObserver.disconnect();
      }
    };
  }

</script>


<style>
  :global(.fit-text) {
    white-space: nowrap;
  }
</style>