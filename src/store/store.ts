import { EventEmitter } from 'events';

type State = { [key: string]: unknown };

export class Store {
  private data = new Map<string, State>();
  readonly events = new EventEmitter();

  get<T>(key: string, prop: string) {
    return this.data.get(key)?.[prop] as T | undefined;
  }

  has(key: string, prop?: string) {
    const state = this.data.get(key);
    if (!state) return false;
    if (!prop) return true;
    return prop in state;
  }

  set(key: string, prop: string, value: unknown) {
    let state = this.data.get(key);
    if (!state) {
      state = {};
      this.data.set(key, state);
    }
    state[prop] = value;
    this.events.emit(`set:${prop}`, key, value, state);
    return this;
  }

  delete(key: string, prop?: string) {
    const state = this.data.get(key);
    if (!state) return false;

    let deleted: boolean;
    if (prop) {
      deleted = delete state[prop];
      if (deleted) {
        this.events.emit(`delete:${prop}`, key, state);
      }
    }
    else {
      deleted = this.data.delete(key);
      if (deleted) {
        this.events.emit(`delete`, key, state);
      }
    }

    return deleted;
  }
}
