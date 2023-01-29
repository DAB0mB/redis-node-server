import { Socket } from 'net';
import { messenger } from 'src/messenger';

export function unsubscribe(args: String[], socket: Socket) {
  const channel = args[0].toString();
  return messenger.unsubscribe(socket, channel) ? 1 : 0;
};
