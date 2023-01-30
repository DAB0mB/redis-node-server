import { EventEmitter } from 'events';
import { readFile, writeFile } from 'fs/promises';
import { Store } from './store';

export class Persistor {
  private saving: Promise<void>;
  private restoring: Promise<void>;
  private autoSaveTimeout: NodeJS.Timeout;
  readonly events = new EventEmitter();

  get autoSaving() {
    return !!this.autoSaveTimeout;
  }

  constructor(
    readonly store: Store,
    readonly dumpPath: string,
    readonly autoSaveInterval: number,
  ) {}

  save() {
    return this.saving ??= (async () => {
      if (this.autoSaving) {
        // Reset interval
        this.stopAutoSave();
        this.autoSave();
      }
      try {
        const data = this.store.toJSON();
        await writeFile(this.dumpPath, JSON.stringify(data));
      }
      finally {
        this.saving = undefined;
      }
    })();
  }

  restore() {
    return this.restoring ??= (async () => {
      try {
        const _data = await readFile(this.dumpPath, { encoding: 'utf-8' });
        const data = JSON.parse(_data);
        this.store.fromJSON(data);
      }
      catch (e) {
        if (!e || e.code !== 'ENOENT') {
          throw e;
        }
      }
      finally {
        this.restoring = undefined;
      }
    })();
  }

  autoSave() {
    if (this.autoSaving) return false;
    if (this.autoSaveInterval <= 0) return;

    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await this.save();
        this.events.emit('autoSave');
      }
      catch (e) {
        this.events.emit('autoSave:error', e);
      }
    }, this.autoSaveInterval * 1000);

    return true;
  }

  stopAutoSave() {
    if (!this.autoSaving) return false;
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = undefined;
    return true;
  }
}
