import { store } from '~/store';
import { kExpiresAt } from '~/store/keys';

export const meta = {
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
};

export function handler([key]: string[]) {
  return store.delete(key, kExpiresAt);
}
