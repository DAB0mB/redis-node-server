import { store } from '~/store';
import { Command } from '../command';

export const del: Command = {
  meta: {
    name: 'del',
    summary: 'Delete a key',
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
    return store.delete(key);
  },
};
