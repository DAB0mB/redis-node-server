import { store } from '~/store';
import { kValue } from '~/store/keys';
import { Command } from '../command';

export const get: Command = {
  meta: {
    name: 'get',
    summary: 'Get the value of a key',
    group: 'string',
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
    return store.get<string>(key, kValue);
  },
};
