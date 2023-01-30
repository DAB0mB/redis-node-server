import { WriteStream, createReadStream, createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import * as readline from 'readline';
import { assertGet } from 'src/assert';
import { Store } from './store';
import { ErrnoException } from 'src/errors';

const delimiter = '\r\n';

export class ActivityRecorder {
  private writer: WriteStream;
  private resetting: Promise<void>;

  get recording() {
    return !!this.writer;
  }

  constructor(
    readonly store: Store,
    readonly activityFile: string,
  ) {}

  record() {
    if (this.recording) return false;
    this.writer = createWriteStream(this.activityFile, { flags: 'a' });
    this.store.events.on('set:*', this.onSetProp);
    this.store.events.on('delete:*', this.onDeleteProp);
    this.store.events.on('delete', this.onDeleteKey);
    return true;
  }

  unrecord() {
    if (!this.recording) return false;
    this.writer.close();
    this.writer = undefined;
    this.store.events.off('set:*', this.onSetProp);
    this.store.events.off('delete:*', this.onDeleteProp);
    this.store.events.off('delete', this.onDeleteKey);
    return true;
  }

  reset() {
    return this.resetting ??= (async () => {
      try {
        await writeFile(this.activityFile, '');
      }
      finally {
        this.resetting = undefined;
        if (this.unrecord()) this.record();
      }
    })();
  }

  async load() {
    let activityCount = 0;
    const reader = createReadStream(this.activityFile);

    const fileExists = await new Promise<boolean>((resolve, reject) => {
      reader.on('open', () => resolve(true));
      reader.on('error', (e?: ErrnoException) => e?.code === 'ENOENT' ? resolve(false) : reject(e));
    });
    if (!fileExists) return activityCount;

    const recorded = this.unrecord();
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
  
        switch (action) {
          case 'set': {
            const key = assertGet(params[0], 'string');
            const prop = assertGet(params[1], 'string');
            const value = params[2];
            this.store.set(key, prop, value);
            break;
          }
          case 'delete': {
            const key = assertGet(params[0], 'string');
            const prop = params[1];
            this.store.delete(key, prop);
            break;
          }
          default: {
            throw new Error(`Unknown action "${action}"`);
          }
        }
        activityCount++;
      }
    }
    finally {
      reader.close();
      if (recorded) this.record();
    }

    return activityCount;
  }

  private onSetProp = async (key: string, prop: string, value: unknown) => {
    await this.resetting;
    this.writer.write(JSON.stringify(['set', key, prop, value]) + delimiter);
  };

  private onDeleteProp = async (key: string, prop: string) => {
    await this.resetting;
    this.writer.write(JSON.stringify(['delete', key, prop]) + delimiter);
  }

  private onDeleteKey = async (key: string) => {
    await this.resetting;
    this.writer.write(JSON.stringify(['delete', key]) + delimiter);
  }
}
