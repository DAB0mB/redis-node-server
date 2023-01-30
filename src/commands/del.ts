import { store } from 'src/store';

export const meta = {
  name: 'del',
  summary: 'Delete a key',
  group: 'generic',
  complexity: 'O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash. Removing a single key that holds a string value is O(1)',
  arguments: [
    {
      name: 'key',
      type: 'key',
      key_spec_index: 0,
    },
  ],
};

export function handler([key]: string[]) {
  return store.delete(key) ? 1 : 0;
}
