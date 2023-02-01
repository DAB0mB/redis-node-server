import { Socket } from 'net';
import { MessageJSON, RawMessage } from '~/resp';

export type CommandMeta = {
  name: string,
  summary: string,
  group: string,
  complexity: string,
  arguments?: CommandArgMeta[],
};

export type CommandArgMeta = {
  name: string,
  type: string,
  key_spec_index?: number,
};

export type CommandContext = {
  socket: Socket,
  commands: CommandsRecord,
};

export type CommandMessage = MessageJSON | RawMessage;
export type CommandHandler = (args: string[], context: CommandContext) => CommandMessage | Promise<CommandMessage>;

export type Command = {
  meta: CommandMeta,
  subcommands?: CommandsRecord,
  handler: CommandHandler,
};

export type CommandsRecord = Record<string, Command>;
