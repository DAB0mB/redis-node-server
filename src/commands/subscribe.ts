import { Socket } from 'net';
import { messenger } from 'src/messenger';

export function subscribe(args: String[], socket: Socket) {
  const channel = args[0].toString();
  return messenger.subscribe(socket, channel) ? 1 : 0;
};
