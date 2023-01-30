import { store } from 'src/store';

let saving: Promise<void>;

export const meta = {
  name: 'save',
  summary: 'Synchronously save the dataset to disk',
  since: '1.0.0',
  group: 'server',
  complexity: 'O(N) where N is the total number of keys in all databases',
};

export async function handler() {
  saving ??= store.dump().finally(() => saving = undefined);
  await saving;
  return 'OK';
};
