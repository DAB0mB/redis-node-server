import { EventEmitter } from 'events';
import { MessageJSON } from '~/resp';
import { assertGet, assertThrow } from '~/utils/assert';

type State = { [key: string]: MessageJSON };

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

  set(key: string, prop: string, value: MessageJSON) {
    let state = this.data.get(key);
    if (!state) {
      state = {};
      this.data.set(key, state);
    }
    state[prop] = value;
    this.events.emit(`set:*`, key, prop, value, state);
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
        this.events.emit(`delete:*`, key, prop, state);
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

  *getEntries() {
    for (const entry of this.data) {
      yield entry;
    }
  }

  setEntry(entry: unknown) {
    assertThrow(entry, Array);
    const key = assertGet(entry[0], 'string');
    const state = assertGet(entry[1], Object) as State;
    for (const [prop, value] of Object.entries(state)) {
      // Trigger events
      this.set(key, prop, value);
    }
  }
}
