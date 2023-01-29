import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export function persist(args: String[]) {
  const key = args[0].toString();
  return store.delete(key, kExpiresAt) ? 1 : 0;
};
