import { WriteStream, createReadStream, createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import * as readline from 'readline';
import { assertGet } from 'src/assert';
import { ErrnoException } from 'src/errors';
import { ArgumentsType, FunctionType } from 'src/functions';
import { Store } from './store';

const kSet = 's';
const kDel = 'd';
const delimiter = '\r\n';

export class ActivityRecorder {
  private writer: WriteStream;
  private clearing: Promise<void>;
  private storeListenersDisabled = false;

  get started() {
    return !!this.writer;
  }

  constructor(
    readonly store: Store,
    readonly activityFile: string,
  ) {}

  start() {
    if (this.started) return false;
    this.writer = this.createFileWriter();
    this.store.events.on('set:*', this.onSetProp);
    this.store.events.on('delete:*', this.onDeleteProp);
    this.store.events.on('delete', this.onDeleteKey);
    return true;
  }

  stop() {
    if (!this.started) return false;
    this.writer.close();
    this.writer = undefined;
    this.store.events.off('set:*', this.onSetProp);
    this.store.events.off('delete:*', this.onDeleteProp);
    this.store.events.off('delete', this.onDeleteKey);
    return true;
  }

  clear() {
    return this.clearing ??= (async () => {
      try {
        await writeFile(this.activityFile, '');
      }
      finally {
        this.clearing = undefined;
        this.resetWriterPosition();
      }
    })();
  }

  async load() {
    let loadCount = 0;
    const reader = createReadStream(this.activityFile);

    const fileExists = await new Promise<boolean>((resolve, reject) => {
      reader.on('open', () => resolve(true));
      reader.on('error', (e?: ErrnoException) => e?.code === 'ENOENT' ? resolve(false) : reject(e));
    });
    if (!fileExists) return loadCount;

    try {
      const lines = readline.createInterface({
        input: reader,
        crlfDelay: Infinity,
      });
  
      for await (const line of lines) {
        let _activity: unknown;
        try {
          _activity = JSON.parse(line);
        }
        catch (e) {
          continue;
        }
        const activity = assertGet(_activity, Array);
        const action = assertGet(activity[0], 'string');
        const params = activity.slice(1);
  
        try {
          this.storeListenersDisabled = true;

          switch (action) {
            case kSet: {
              const key = assertGet(params[0], 'string');
              const prop = assertGet(params[1], 'string');
              const value = params[2];
              this.store.set(key, prop, value);
              break;
            }
            case kDel: {
              const key = assertGet(params[0], 'string');
              const prop = params[1];
              this.store.delete(key, prop);
              break;
            }
            default: {
              throw new Error(`Unknown action "${action}"`);
            }
          }
        }
        finally {
          this.storeListenersDisabled = false;
        }

        loadCount++;
      }
    }
    finally {
      reader.close();
    }

    return loadCount;
  }

  private createFileWriter() {
    return createWriteStream(this.activityFile, { flags: 'a' });
  }

  private resetWriterPosition() {
    if (!this.writer) return;
    this.writer.close();
    this.writer = this.createFileWriter();
  }

  private createStoreListener<F extends FunctionType>(fn: F) {
    return async (...args: ArgumentsType<F>) => {
      if (this.storeListenersDisabled) return;
      await this.clearing;
      if (!this.started) return;
      return fn(...args) as ReturnType<F>;
    };
  }

  private onSetProp = this.createStoreListener((key: string, prop: string, value: unknown) => {
    this.writer.write(JSON.stringify([kSet, key, prop, value]) + delimiter);
  });

  private onDeleteProp = this.createStoreListener((key: string, prop: string) => {
    this.writer.write(JSON.stringify([kDel, key, prop]) + delimiter);
  });

  private onDeleteKey = this.createStoreListener((key: string) => {
    this.writer.write(JSON.stringify([kDel, key]) + delimiter);
  });
}
