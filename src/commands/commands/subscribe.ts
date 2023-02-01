import { messenger } from '~/messenger';
import { Command } from '../command';

export const subscribe: Command = {
  meta: {
    name: 'subscribe',
    summary: 'Listen for messages published to a given channel',
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
    return messenger.subscribe(socket, channel);
  },
};
