import { Socket } from 'net';
import { Message, RawMessage } from 'src/resp';

export type CommandArg = {
  name: string,
  type: string,
  key_spec_index?: number,
};

export type CommandMeta = {
  name: string,
  summary: string,
  since: string,
  group: string,
  complexity: string,
  arguments?: CommandArg[],
};

export type CommandHandler = (this: CommandsRecord, args: string[], socket: Socket) => Message | RawMessage | Promise<Message | RawMessage>;

export type Command = {
  meta: CommandMeta,
  subcommands?: CommandsRecord,
  handler: CommandHandler,
};

export type CommandsRecord = Record<string, Command>;
