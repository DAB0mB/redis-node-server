import { Message, RawMessage } from 'src/resp';

export type Command = {
  (args: String[]): Message | RawMessage | Promise<Message | RawMessage>,
  name: string,
};
