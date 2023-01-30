import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export const meta = {
  name: 'expire',
  summary: 'Set a key\'s time to live in seconds',
  since: '1.0.0',
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
};

export function handler(args: String[]) {
  const key = args[0].toString();
  const ttl = Number(args[1]);
  if (!store.has(key)) return 0;
  store.set(key, kExpiresAt, Date.now() + toMiliseconds(ttl));
  return 1;
};

const toMiliseconds = (s: number) => {
  return s * 1000;
};
