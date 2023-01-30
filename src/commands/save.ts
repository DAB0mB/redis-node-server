import { SimpleString } from 'src/resp';
import { persistor } from 'src/store';

export const meta = {
  name: 'save',
  summary: 'Save the dataset to disk',
  group: 'server',
  complexity: 'O(N) where N is the total number of keys in all databases',
};

export async function handler() {
  await persistor.save();
  return new SimpleString('OK');
}
