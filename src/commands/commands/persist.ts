import { store } from '~/store';
import { kExpiresAt } from '~/store/keys';
import { Command } from '../command';

export const persist: Command = {
  meta: {
    name: 'persist',
    summary: 'Remove the expiration from a key',
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
    return store.delete(key, kExpiresAt);
  },
};
