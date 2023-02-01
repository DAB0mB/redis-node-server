import { SimpleString } from '~/resp';
import { dataRecorder } from '~/store';
import { Command } from '../command';

export const save: Command = {
  meta: {
    name: 'save',
    summary: 'Asynchronously save the datastore to disk',
    group: 'server',
    complexity: 'O(1)',
  },

  handler() {
    dataRecorder.save();
    return new SimpleString('OK');
  },
};
