<script module lang="ts">

  import { db } from '../../db/db';
  import type Folder from '../../db/folder';
  import { liveQuery, type Observable } from 'dexie';


  class FolderStore {
    folderObservable: Observable<Folder[]>;
    currentId: number = $state(1);
    folders: Folder[] = $state([]);

    constructor(fo: Observable<Folder[]>) {
      this.folderObservable = fo;
    }
  }

  // Observable setup
  const folderObservable: Observable<Folder[]> = liveQuery(
    () => db.folders.toArray()
  );

  export const folderStore = new FolderStore(folderObservable);

  folderObservable.subscribe({
    next: result => {
      folderStore.folders = result;
    },
    error: error => {
      console.error(error);
    }
  });


</script>