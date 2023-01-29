import { store } from 'src/store';
import { kValue } from 'src/store/keys';

export function get(args: String[]) {
  const key = args[0].toString();
  return store.get<string>(key, kValue) ?? null;
};
