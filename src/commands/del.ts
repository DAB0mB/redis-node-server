import { store } from 'src/store';

export function del(args: String[]) {
  const key = args[0].toLowerCase();
  return store.delete(key) ? 1 : 0;
};
