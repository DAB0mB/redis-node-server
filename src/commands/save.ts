import { SimpleString } from 'src/resp';
import { store } from 'src/store';

let saving: Promise<void>;

export const meta = {
  name: 'save',
  summary: 'Save the dataset to disk',
  group: 'server',
  complexity: 'O(N) where N is the total number of keys in all databases',
};

export async function handler() {
  saving ??= store.dump().finally(() => saving = undefined);
  await saving;
  return new SimpleString('OK');
}
