import { Socket } from 'net';
import { RawMessage, parseMessage, stringifyMessage } from '~/resp';
import { assertGet } from '~/utils/assert';
import { UnknownCommandError } from '~/utils/errors';
import { call } from '~/utils/functions';
import { Command } from './command';
import { commands } from './commands';
import { error } from '~/utils/console';

export const onCommandRequest = async (socket: Socket, data: Buffer) => {
  try {
    const localMessage = assertGet(parseMessage(data.toString()), Array);
    const args = localMessage.map(m => assertGet(m, 'string'));
    let subcommands = commands;
    let commandName: string;
    let command: Command;
    do {
      commandName = args.shift().toLowerCase();
      command = subcommands[commandName];
      if (!command) {
        throw new UnknownCommandError(commandName);
      }
      subcommands = command.subcommands;
    } while (subcommands && args.length);
    const remoteMessage = await callCommand(command, args, socket);
    if (remoteMessage instanceof RawMessage) {
      socket.write(remoteMessage.toString());
    }
    else {
      socket.write(stringifyMessage(remoteMessage));
    }
  }
  catch (e) {
    socket.write(stringifyMessage(e));
  }
}

const callCommand = async (command: Command, args: string[], socket: Socket) => {
  try {
    return await call(command.handler, commands, args, socket);
  }
  catch (e) {
    error(`Failed to handle command "${command.meta.name}"`, e);
    throw new Error('Internal server error');
  }
};
