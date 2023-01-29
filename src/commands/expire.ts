import { store } from 'src/store';
import { kExpiresAt } from 'src/store/keys';

export function expire(args: String[]) {
  const key = args[0].toString();
  const ttl = Number(args[1]);
  if (!store.has(key)) return 0;
  store.set(key, kExpiresAt, Date.now() + toMiliseconds(ttl));
  return 1;
};

const toMiliseconds = (s: number) => {
  return s * 1000;
};
