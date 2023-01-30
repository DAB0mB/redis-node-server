import { Socket } from 'net';
import { Message, RawMessage } from 'src/resp';

export type Command = {
  (args: String[], socket: Socket): Message | RawMessage | Promise<Message | RawMessage>,
  subCommands?: Record<string, Command>,
};
