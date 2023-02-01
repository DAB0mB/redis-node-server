import { store } from '~/store';
import { kExpiresAt } from '~/store/keys';
import { Command } from '../command';

export const expire: Command = {
  meta: {
    name: 'expire',
    summary: 'Set a key\'s time to live in seconds',
    group: 'generic',
    complexity: 'O(1)',
    arguments: [
      {
        name: 'key',
        type: 'key',
        key_spec_index: 0,
      },
      {
        name: 'seconds',
        type: 'integer',
      },
    ],
  },

  handler([key, _ttl]) {
    const ttl = Number(_ttl);
    if (!store.has(key)) return false;
    store.set(key, kExpiresAt, Date.now() + toMiliseconds(ttl));
    return true;
  },
};

const toMiliseconds = (s: number) => {
  return s * 1000;
};
