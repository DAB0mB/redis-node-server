import { messenger } from '~/messenger';
import { Command } from '../command';

export const unsubscribe: Command = {
  meta: {
    name: 'unsubscribe',
    summary: 'Stop listening for messages posted to a given channel',
    group: 'pubsub',
    complexity: 'O(1)',
    arguments: [
      {
        name: 'channel',
        type: 'string',
      },
    ],
  },

  handler([channel], { socket }) {
    return messenger.unsubscribe(socket, channel);
  },
};
