import { SimpleString } from '~/resp';
import { dataRecorder } from '~/store';
import { Command } from '../command';

export const bgsave: Command = {
  meta: {
    name: 'bgsave',
    summary: 'Asynchronously save the datastore to disk',
    group: 'server',
    complexity: 'O(1)',
  },

  handler() {
    dataRecorder.save();
    return new SimpleString('OK');
  },
};
