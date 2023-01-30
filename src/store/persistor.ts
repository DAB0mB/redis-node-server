import { readFile, writeFile } from 'fs/promises';
import { Store } from './store';

export class Persistor {
  private saving: Promise<void>;
  private restoring: Promise<void>;

  constructor(
    readonly store: Store,
    readonly dumpPath: string,
  ) {}

  save() {
    return this.saving ??= (async () => {
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
      finally {
        this.restoring = undefined;
      }
    })();
  }
}
