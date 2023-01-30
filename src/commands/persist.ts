import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export const meta = {
  name: 'persist',
  summary: 'Remove the expiration from a key',
  since: '1.0.0',
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

export function handler(args: String[]) {
  const key = args[0].toString();
  return store.delete(key, kExpiresAt) ? 1 : 0;
};
