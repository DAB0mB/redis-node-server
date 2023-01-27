import { Message, RawMessage } from 'src/resp';

export type Command = {
  (message: Message[]): Message | RawMessage,
  name: string,
};
