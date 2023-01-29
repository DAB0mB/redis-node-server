import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export function ttl(args: String[]) {
  const key = args[0].toString();
  if (!store.has(key)) return -2;
  const expiresAt = store.get<number>(key, kExpiresAt);
  if (!expiresAt) return -1;
  return toSeconds(expiresAt - Date.now());
};

const toSeconds = (ms: number, transform = Math.floor) => {
  return transform(ms / 1000);
};
