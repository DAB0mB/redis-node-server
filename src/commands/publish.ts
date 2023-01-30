import { messenger } from 'src/messenger';

export const meta = {
  name: 'publish',
  summary: 'Post a message to a channel',
  since: '1.0.0',
  group: 'pubsub',
  complexity: 'O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total number of subscribed patterns (by any client).',
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
};

export function handler([channel, message]: string[]) {
  return messenger.publish(channel, message);
}
