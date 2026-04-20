import AppDB from './appDB'

export const db = new AppDB();

export type DBResponse = { response: any, state: string };

export class Database {

  static async addTaskie(
    folderId: number,
    title: string, description: string = '',
    repeatAmount: number = 0, repeatCounter: number = 0,
    position: number = 0, state: number = 0, 
    checkTime: number|null = null, occasionTime: number|null = null
  ): Promise<DBResponse> {
    try {
      const id: number = await db.taskies.add({ 
        folderId,
        title, description,
        repeatAmount, repeatCounter,
        position, state,
        checkTime, occasionTime
      });

      return { response: id, state: `Taskie "${title}" id:${id} was successfully added.` };
    } catch (error) {
      return { response: null, state: `Failed to add taskie ${title}: ${error}` };
    }
  }

  static async addFolder(
    name: string, emoji: string = '',
    tabName: string = '', occasional: boolean = false,
  ): Promise<DBResponse> {
    try {
      const id: number = await db.folders.add({ 
        name, emoji, tabName, occasional
      });

      return { response: id, state: `Folder "${name}" id:${id} was successfully added.` };
    } catch (error) {
      return { response: null, state: `Failed to add folder ${name}: ${error}` };
    }
  }

}