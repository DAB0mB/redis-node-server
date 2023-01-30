import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export const meta = {
  name: 'ttl',
  summary: 'Get the time to live for a key in seconds',
  group: 'generic',
  complexity: 'O(1)',
  arguments: [
    {
      name: 'key',
      type: 'key',
      key_spec_index: 0,
    },
  ],
};

export function handler([key]: string[]) {
  if (!store.has(key)) return -2;
  const expiresAt = store.get<number>(key, kExpiresAt);
  if (!expiresAt) return -1;
  return toSeconds(expiresAt - Date.now());
}

const toSeconds = (ms: number, transform = Math.floor) => {
  return transform(ms / 1000);
};
