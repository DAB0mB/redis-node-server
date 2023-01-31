import { EventEmitter } from 'events';
import { JSONLFile, JSONRecord, } from '~/jsonl';
import { Store } from './store';

export class DataRecorder {
  private saving: Promise<void>;
  private loading: Promise<void>;
  private recordTimeout: NodeJS.Timeout;
  private dataFile = new JSONLFile(this.dataFilePath);
  readonly events = new EventEmitter();

  get started() {
    return !!this.recordTimeout;
  }

  constructor(
    readonly store: Store,
    readonly dataFilePath: string,
    readonly recordInterval: number,
  ) {}

  save() {
    return this.saving ??= (async () => {
      const writer = this.dataFile.createWriter();

      if (this.started) {
        // Reset interval
        this.stop();
        this.start();
      }

      try {
        await this.dataFile.clear();
        await writer.next();
        for (const entry of this.store.getEntries()) {
          await writer.next(entry as JSONRecord);
        }
      }
      finally {
        this.saving = undefined;
        writer.return();
      }

      this.events.emit('save');
    })();
  }

  load() {
    return this.loading ??= (async () => {
      const reader = this.dataFile.createReader();

      try {
        for await (const line of reader) {
          this.store.setEntry(line);
        }
      }
      catch (e) {
        if (!e || e.code !== 'ENOENT') {
          throw e;
        }
      }
      finally {
        this.loading = undefined;
        reader.return();
      }
    })();
  }

  start() {
    if (this.started) return false;
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
    if (!this.started) return false;
    clearTimeout(this.recordTimeout);
    this.recordTimeout = undefined;
    return true;
  }
}
