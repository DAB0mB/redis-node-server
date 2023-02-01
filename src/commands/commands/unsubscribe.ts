import { messenger } from '~/messenger';
import { Command } from '../command';

export const unsubscribe: Command = {
  meta: {
    name: 'unsubscribe',
    summary: 'Stop listening for messages posted to the given channels',
    group: 'pubsub',
    complexity: 'O(N) where N is the number of clients already subscribed to a channel',
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
