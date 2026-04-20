import { Entity } from 'dexie';
import type AppDB from './appDB';
import type { TaskieEditData } from './Taskie.svelte';


export default class Taskie extends Entity<AppDB> {
  id!: number;
  folderId!: number;
  title!: string;
  description!: string;
  repeatAmount!: number;
  repeatCounter!: number;
  position!: number;
  state!: number;
  checkTime!: number|null;
  occasionTime!: number|null;

  async incrementRepeatCounter(): Promise<void> {
    await this.db.taskies.update(this.id, (taskie) => { taskie.repeatCounter++ });
  }
  async resetRepeatCounter(): Promise<void> {
    await this.db.taskies.update(this.id, { repeatCounter: 0 });
  }
  async setRepeatCounter(counter: number): Promise<void> {
    await this.db.taskies.update(this.id, { repeatCounter: counter });
  }
  async setPosition(position: number): Promise<void> {
    await this.db.taskies.update(this.id, { position: position });
  }
  async resetState(): Promise<void> {
    await this.db.taskies.update(this.id, { state: 0 });
  }
  async setState(state: number): Promise<void> {
    await this.db.taskies.update(this.id, { state: state });
  }
  async setCheckTime(time: number|null): Promise<void> {
    await this.db.taskies.update(this.id, { checkTime: time });
  }
  async setOccasionTime(time: number|null): Promise<void> {
    await this.db.taskies.update(this.id, { occasionTime: time });
  }
  async edit(data: TaskieEditData): Promise<void> {
    await this.db.taskies.update(this.id, {
      title: data.title,
      description: data.description,
      repeatAmount: data.repeatAmount
    });
  }
  async delete(): Promise<void> {
    await this.db.taskies.delete(this.id);
  }
}