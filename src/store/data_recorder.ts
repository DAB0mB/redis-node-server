import { EventEmitter } from 'events';
import { readFile, writeFile } from 'fs/promises';
import { Store } from './store';

export class DataRecorder {
  private saving: Promise<void>;
  private restoring: Promise<void>;
  private recordTimeout: NodeJS.Timeout;
  readonly events = new EventEmitter();

  get recording() {
    return !!this.recordTimeout;
  }

  constructor(
    readonly store: Store,
    readonly dataFile: string,
    readonly recordInterval: number,
  ) {}

  save() {
    return this.saving ??= (async () => {
      if (this.recording) {
        // Reset interval
        this.stop();
        this.record();
      }
      try {
        const data = this.store.toJSON();
        await writeFile(this.dataFile, JSON.stringify(data));
        this.events.emit('save');
      }
      finally {
        this.saving = undefined;
      }
    })();
  }

  load() {
    return this.restoring ??= (async () => {
      try {
        const _data = await readFile(this.dataFile, { encoding: 'utf-8' });
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

  record() {
    if (this.recording) return false;
    if (this.recordInterval <= 0) return;

    this.recordTimeout = setTimeout(async () => {
      try {
        await this.save();
        this.events.emit('recorded');
      }
      catch (e) {
        this.events.emit('record:error', e);
      }
    }, this.recordInterval * 1000);

    return true;
  }

  stop() {
    if (!this.recording) return false;
    clearTimeout(this.recordTimeout);
    this.recordTimeout = undefined;
    return true;
  }
}
