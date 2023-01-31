import { SimpleString } from '~/resp';
import { store } from '~/store';
import { kValue } from '~/store/keys';

export const meta = {
  name: 'set',
  summary: 'Set the string value of a key',
  group: 'string',
  complexity: 'O(1)',
  arguments: [
    {
      name: 'key',
      type: 'key',
      key_spec_index: 0,
    },
    {
      name: 'value',
      type: 'string',
    },
  ],
};

export function handler([key, value]: string[]) {
  store.set(key, kValue, value);
  return new SimpleString('OK');
}
