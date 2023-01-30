import { Socket } from 'net';
import { messenger } from 'src/messenger';

export const meta = {
  name: 'subscribe',
  summary: 'Listen for messages published to the given channels',
  since: '1.0.0',
  group: 'pubsub',
  complexity: 'O(N) where N is the number of channels to subscribe to.',
  arguments: [
    {
      name: 'channel',
      type: 'string',
    },
  ],
};

export function handler([channel]: string[], socket: Socket) {
  return messenger.subscribe(socket, channel) ? 1 : 0;
}
