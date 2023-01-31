import { createReadStream, createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import * as readline from 'readline';
import { ErrnoException } from './errors';

export function clearFile(filePath: string) {
  return writeFile(filePath, '');
}

export async function* createLineWriter(filePath: string): AsyncGenerator<void, void, string> {
  const writer = createWriteStream(filePath, { flags: 'a' });

  await new Promise<unknown>((resolve, reject) => {
    writer.on('open', resolve);
    writer.on('error', reject);
  });

  try {
    while (true) {
      const line = yield;
      await new Promise<void>((resolve, reject) => {
        writer.write(line + '\n', (err) => {
          err ? reject(err) : resolve();
        });
      });
    }
  }
  finally {
    writer.close();
  }
}

export async function* createLineReader(filePath: string) {
  const reader = createReadStream(filePath);

  const fileExists = await new Promise<boolean>((resolve, reject) => {
    reader.on('open', () => resolve(true));
    reader.on('error', (e?: ErrnoException) => e?.code === 'ENOENT' ? resolve(false) : reject(e));
  });
  if (!fileExists) return;

  try {
    const lines = readline.createInterface({ input: reader });
    for await (const line of lines) {
      yield line.toString();
    }
  }
  finally {
    reader.close();
  }
}
