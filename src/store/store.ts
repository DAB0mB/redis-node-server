import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs/promises';
import { assertGet, assertThrow } from 'src/assert';

type State = { [key: string]: unknown };

export type StoreConfig = {
  dumpPath: string,
};

export class Store {
  private data = new Map<string, State>();
  readonly events = new EventEmitter();

  constructor(private config: Partial<StoreConfig> = {}) {
    this.config.dumpPath ??= path.resolve(process.cwd(), 'dump.json');
  }

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

  dump() {
    const dataText = JSON.stringify([...this.data.entries()]);
    return fs.writeFile(this.config.dumpPath, dataText);
  }

  async restore() {
    try {
      await fs.stat(this.config.dumpPath)
    }
    catch (e) {
      // Dump file not found
      return false;
    }

    const dataText = await fs.readFile(this.config.dumpPath, { encoding: 'utf-8' });
    const data = assertGet(JSON.parse(dataText), Array).map(entry => {
      assertThrow(entry, Array);
      const key = assertGet(entry[0], 'string');
      const state = assertGet(entry[1], Object) as State;
      return [key, state] as const;
    });

    data.forEach(([key, state]) => {
      for (const [prop, value] of Object.entries(state)) {
        // Trigger events
        this.set(key, prop, value);
      }
    });

    return true;
  }
}
