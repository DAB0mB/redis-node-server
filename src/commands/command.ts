import { Socket } from 'net';
import { MessageJSON, RawMessage } from '~/resp';

export type CommandArg = {
  name: string,
  type: string,
  key_spec_index?: number,
};

export type CommandMeta = {
  name: string,
  summary: string,
  group: string,
  complexity: string,
  arguments?: CommandArg[],
};

export type CommandHandler = (this: CommandsRecord, args: string[], socket: Socket) => MessageJSON | RawMessage | Promise<MessageJSON | RawMessage>;

export type Command = {
  meta: CommandMeta,
  subcommands?: CommandsRecord,
  handler: CommandHandler,
};

export type CommandsRecord = Record<string, Command>;
