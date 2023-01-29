import { Message } from 'src/resp';
import { store } from 'src/store';
import { kValue } from 'src/store/keys';

export function set(args: Message[]) {
  const key = args[0].toString();
  const value = args[1];
  store.set(key, kValue, value);
  return 'OK';
};
