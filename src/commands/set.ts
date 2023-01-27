import { assertGet } from 'src/assert';
import { Message } from 'src/resp';
import store from 'src/store';

export function set(message: Message[]) {
  const key = assertGet(message[0], String).toString();
  const value = assertGet(message[1], String).toString();
  store.set(key, value);
  return 'OK';
};
