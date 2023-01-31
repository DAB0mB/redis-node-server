import { store } from '~/store';
import { kValue } from '~/store/keys';

export const meta = {
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
};

export function handler([key]: string[]) {
  return store.get<string>(key, kValue);
}
