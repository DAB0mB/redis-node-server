import { messenger } from '~/messenger';
import { Command } from '../command';

export const publish: Command = {
  meta: {
    name: 'publish',
    summary: 'Post a message to a channel',
    group: 'pubsub',
    complexity: 'O(N) where N is the number of clients subscribed to the receiving channel',
    arguments: [
      {
        name: 'channel',
        type: 'string',
      },
      {
        name: 'message',
        type: 'string',
      },
    ],
  },

  handler([channel, message]) {
    return messenger.publish(channel, message);
  },
};
