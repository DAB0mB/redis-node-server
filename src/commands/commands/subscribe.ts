import { messenger } from '~/messenger';
import { Command } from '../command';

export const subscribe: Command = {
  meta: {
    name: 'subscribe',
    summary: 'Listen for messages published to the given channels',
    group: 'pubsub',
    complexity: 'O(N) where N is the number of channels to subscribe to',
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
