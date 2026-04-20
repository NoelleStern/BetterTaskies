<script module lang="ts">

  import { db } from '../../db/db';
  import { get } from 'svelte/store';
  import Taskie from '../../db/taskie';
  import { m } from '../../paraglide/messages';
  import { Category, Underlay } from './Category.svelte';
  import { liveQuery, type Observable, type Subscription } from 'dexie';
  import { yrellisDoneIcon, yrellisTodoIcon } from '../Stores/SettingsStore.svelte';

  import RemoveIcon from '~icons/ic/baseline-close';
  import ConfirmIcon from '~icons/ic/baseline-check';


  // Categories
  function createTodoCategory(): Category {
    return new Category(
      m.todoSeparatorTitle(), get(yrellisTodoIcon).sticker.path,
      new Underlay(ConfirmIcon, 'bg-success text-success-content'), false, '✨',
      (taskies: Taskie[]) => {
        return taskies.sort((a, b) => a.position! - b.position!);
      }
    );
  }
  function createDoneCategory(): Category {
    return new Category(
      m.doneSeparatorTitle(), get(yrellisDoneIcon).sticker.path,
      new Underlay(RemoveIcon, 'bg-error text-error-content'), true, '',
      (taskies: Taskie[]) => {
        return taskies.sort((a, b) => a.checkTime! - b.checkTime!);
      }
    );
  }
  export function createDefaultCategoryPool(): Category[] {
    return [createTodoCategory(), createDoneCategory()];
  }

  
  // Observable setup
  export function createObservable(folderId: number): Observable<Taskie[]> {
    return liveQuery( () => db.taskies.where({folderId}).toArray() );
  }
  export function createSubscription(observable: Observable<Taskie[]>, taskiePool: Taskie[], categoryPool: Category[]): Subscription {
    return observable.subscribe({
      next: result => {
        // Update the value without changing array's identity
        const newArray: Taskie[] = result.sort((a, b) => a.position! - b.position!);
        taskiePool.splice(0, taskiePool.length, ...newArray);

        // Should also work
        categoryPool.forEach((category: Category, index: number) => {
          const newTaskies: Taskie[] = result.filter(taskie => taskie.state == index);
          if (!category.sortingFunction) { category.taskies = newTaskies; }
          else { category.taskies = category.sortingFunction(newTaskies); }
        });
      },
      error: error => {
        // TODO: address
        console.error(error);
      }
    });
  }

</script>