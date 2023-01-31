import { SimpleString } from '~/resp';
import { dataRecorder } from '~/store';

export const meta = {
  name: 'save',
  summary: 'Save the dataset to disk',
  group: 'server',
  complexity: 'O(N) where N is the total number of keys in all databases',
};

export async function handler() {
  await dataRecorder.save();
  return new SimpleString('OK');
}
