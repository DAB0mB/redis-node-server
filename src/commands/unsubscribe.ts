import { Socket } from 'net';
import { messenger } from 'src/messenger';

export const meta = {
  name: 'unsubscribe',
  summary: 'Stop listening for messages posted to the given channels',
  since: '1.0.0',
  group: 'pubsub',
  complexity: 'O(N) where N is the number of clients already subscribed to a channel.',
  arguments: [
    {
      name: 'channel',
      type: 'string',
    },
  ],
};

export function handler(args: String[], socket: Socket) {
  const channel = args[0].toString();
  return messenger.unsubscribe(socket, channel) ? 1 : 0;
};
