import { Sortable, type ScrollableOptions, type SortableStopEvent } from '@shopify/draggable';

export interface SortableOptions {
  scrollable?: ScrollableOptions;
  onUpdate?: (oid: number, nid: number) => void;
  onSortableStart?: (event: any) => void;
  onSortableStop?: (event: any) => void;
  onSorted?: (event: any) => void;
  onDragMove?: (event: any) => void;
}
export function sortable(
  el: HTMLElement,
  options: SortableOptions
) {
  const sortable = new Sortable(el, {
    draggable: "[data-sortable-item]",
    delay: {
      mouse: 80,
      touch: 150,
    },
    mirror: {
      appendTo: document.body,
      constrainDimensions: true
    },
    scrollable: options.scrollable
  });

  const handleStop = (event: SortableStopEvent) => {
    const { oldIndex, newIndex } = event;
    if (oldIndex == newIndex) return;
    event.cancel();

    options.onUpdate?.(oldIndex, newIndex);
  };
  sortable.on("sortable:stop", handleStop);

  if (options.onSortableStart) {
    sortable.on('sortable:start', options.onSortableStart);
  }

  if (options.onSortableStop) {
    sortable.on('sortable:stop', options.onSortableStop);
  }

  if (options.onSorted) {
    sortable.on('sortable:sorted', options.onSorted);
  }

  if (options.onDragMove) {
    sortable.on('drag:move', options.onDragMove);
  }

  return {
    destroy() {
      sortable.destroy();
    }
  };
}