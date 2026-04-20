import Taskie from './taskie';
import Folder from './folder';
import Dexie, { type EntityTable, type Transaction } from 'dexie';

export default class AppDB extends Dexie {
  folders!: EntityTable<Folder, 'id'>;
  taskies!: EntityTable<Taskie, 'id'>;

  constructor() {
    super('TaskiesDB');

    this.version(1).stores({
      folders: '++id, name, emoji, occasional',
      taskies: '++id, folderId, title, description, repeatAmount, repeatCounter, position, state, checkTime, occasionTime',
    });
    this.on('populate', function(tx: Transaction) {
      tx.table('folders').bulkAdd([
        { name: 'Day', emoji: '☀️', tabName: 'Daily Taskies', occasional: false },
        { name: 'Week', emoji: '7️⃣', tabName: 'Weekly Taskies', occasional: false },
        { name: 'Month', emoji: '📅', tabName: 'Monthly Taskies', occasional: false },
        { name: 'General', emoji: '🎯', tabName: 'General Taskies', occasional: false }
      ]);
    });

    this.folders.mapToClass(Folder);
    this.taskies.mapToClass(Taskie);
  }
}