import { clearFile, createLineReader, createLineWriter } from './utils/fs';

export type JSONRecord = null | string | number | boolean | JSONRecord[] | { [key: string]: JSONRecord };
export type JSONLWriter = AsyncGenerator<void, void, JSONRecord>;
export type JSONLReader = AsyncGenerator<JSONRecord, void, void>;

export class JSONLFile {
  constructor(readonly path: string) {}

  clear() {
    return clearFile(this.path);
  }

  async *createWriter(): JSONLWriter {
    const writer = createLineWriter(this.path);

    try {
      await writer.next();
      while (true) {
        const json = yield;
        await writer.next(JSON.stringify(json));
      }
    }
    finally {
      writer.return();
    }
  }

  async *createReader(): JSONLReader {
    const reader = createLineReader(this.path);

    try {
      for await (const line of reader) {
        yield JSON.parse(line);
      }
    }
    finally {
      reader.return();
    }
  }
}
