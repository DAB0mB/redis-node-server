import { JSONLFile, JSONLWriter, JSONRecord } from '~/jsonl';
import { assertGet } from '~/utils/assert';
import { ArgumentsType, FunctionType } from '~/utils/functions';
import { Store } from './store';

const kSet = 's';
const kDel = 'd';

export class ActivityRecorder {
  private writer: JSONLWriter;
  private clearing: Promise<void>;
  private loading: Promise<number>;
  private storeListenersDisabled = false;
  private activityFile = new JSONLFile(this.activityFilePath);

  get started() {
    return !!this.writer;
  }

  constructor(
    readonly store: Store,
    readonly activityFilePath: string,
  ) {}

  start() {
    if (this.started) return false;
    this.writer = this.createWriter();
    this.store.events.on('set:*', this.onSetProp);
    this.store.events.on('delete:*', this.onDeleteProp);
    this.store.events.on('delete', this.onDeleteKey);
    return true;
  }

  stop() {
    if (!this.started) return false;
    this.writer.return();
    this.writer = undefined;
    this.store.events.off('set:*', this.onSetProp);
    this.store.events.off('delete:*', this.onDeleteProp);
    this.store.events.off('delete', this.onDeleteKey);
    return true;
  }

  clear() {
    return this.clearing ??= (async () => {
      try {
        await this.activityFile.clear();
      }
      finally {
        this.clearing = undefined;
        this.resetWriterPosition();
      }
    })();
  }

  load() {
    return this.loading ??= (async () => {
      const reader = this.activityFile.createReader();
      let loadCount = 0;

      try {
        for await (const line of reader) {
          const activity = assertGet(line, Array);
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
        this.loading = undefined;
        reader.return();
      }

      return loadCount;
    })();
  }

  private createWriter() {
    const writer = this.activityFile.createWriter();
    writer.next();
    return writer;
  }

  private resetWriterPosition() {
    if (!this.writer) return;
    this.writer.return();
    this.writer = this.createWriter();
  }

  private createStoreListener<F extends FunctionType>(fn: F) {
    return async (...args: ArgumentsType<F>) => {
      if (this.storeListenersDisabled) return;
      await this.clearing;
      if (!this.started) return;
      return fn(...args) as ReturnType<F>;
    };
  }

  private onSetProp = this.createStoreListener((key: string, prop: string, value: JSONRecord) => {
    this.writer.next([kSet, key, prop, value]);
  });

  private onDeleteProp = this.createStoreListener((key: string, prop: string) => {
    this.writer.next([kDel, key, prop]);
  });

  private onDeleteKey = this.createStoreListener((key: string) => {
    this.writer.next([kDel, key]);
  });
}
