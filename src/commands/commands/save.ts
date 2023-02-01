import { SimpleString } from '~/resp';
import { dataRecorder } from '~/store';
import { Command } from '../command';

export const save: Command = {
  meta: {
    name: 'save',
    summary: 'Save the dataset to disk',
    group: 'server',
    complexity: 'O(N) where N is the total number of keys in all databases',
  },

  async handler() {
    await dataRecorder.save();
    return new SimpleString('OK');
  },
};
