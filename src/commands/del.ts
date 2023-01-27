import { assertGet } from 'src/assert';
import { Message } from 'src/resp';
import store from 'src/store';

export function del(message: Message[]) {
  const key = assertGet(message[0], String).toString();
  return store.delete(key) ? 1 : 0;
};
