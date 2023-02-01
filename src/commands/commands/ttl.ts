import { store } from '~/store';
import { kExpiresAt } from '~/store/keys';
import { Command } from '../command';

export const ttl: Command = {
  meta: {
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
  },

  handler([key]) {
    if (!store.has(key)) return -2;
    const expiresAt = store.get<number>(key, kExpiresAt);
    if (!expiresAt) return -1;
    return toSeconds(expiresAt - Date.now());
  },
};

const toSeconds = (ms: number, transform = Math.floor) => {
  return transform(ms / 1000);
};
