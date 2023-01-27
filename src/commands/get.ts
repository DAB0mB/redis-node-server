import { assertGet } from 'src/assert';
import { Message } from 'src/resp';
import store from 'src/store';

export function get(message: Message[]) {
  const key = assertGet(message[0], String).toString();
  return store.get(key) ?? null;
};
