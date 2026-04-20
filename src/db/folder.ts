import { Entity } from 'dexie';
import type AppDB from './appDB';
import { m } from '../paraglide/messages';

export class Title {
  name: string;
  emoji: string;

  constructor(name: string, emoji: string) {
    this.name = name;
    this.emoji = emoji;
  }

  toString(): string {
    return `${this.emoji} ${this.name}`
  }
}

export default class Folder extends Entity<AppDB> {
  id!: number;
  name!: string;
  emoji!: string;
  tabName!: string;
  occasional!: boolean;

  getName(): string {
    return this.name;
  }

  getTitleName(): string {
    let result: string = '';

    /* Day-1, Week-2, Month-3, General-4 */
    if (this.id <= 4) {
      switch (this.id) {
        case 1: result = m.appTitleDaily(); break;
        case 2: result = m.appTitleWeekly(); break;
        case 3: result = m.appTitleMonthly(); break;
        case 4: result = m.appTitleGeneral(); break;
      }
    } else { result = this.name; }

    return result;
  }

  getTabName(): string {
    let result: string = '';

    /* Day-1, Week-2, Month-3, General-4 */
    if (this.id <= 4) {
      switch (this.id) {
        case 1: result = m.tasksDaily(); break;
        case 2: result = m.tasksWeekly(); break;
        case 3: result = m.tasksMonthly(); break;
        case 4: result = m.tasksGeneral(); break;
      }
    } else { result = this.tabName; }

    return result;
  }
  getTabHref(): string {
    return `taskies/${this.getName().toLowerCase()}`;
  }
}