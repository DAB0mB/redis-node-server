import { Socket } from 'net';
import { messenger } from 'src/messenger';

export function publish(args: String[]) {
  const channel = args[0].toString();
  const message = args[1];
  return messenger.publish(channel, message);
};
