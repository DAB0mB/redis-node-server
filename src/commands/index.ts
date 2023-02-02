import { Socket } from 'net';
import { RawMessage, parseMessage, stringifyMessage } from '~/resp';
import { assertGet } from '~/utils/assert';
import { writeError } from '~/utils/console';
import { UnknownCommandError } from '~/utils/errors';
import { Command, CommandMessage } from './command';
import { commands } from './commands';

export async function onCommandRequest(socket: Socket, data: Buffer) {
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

    let remoteMessage: CommandMessage;
    try {
      remoteMessage = await command.handler(args, { socket, commands });
    }
    catch (e) {
      writeError(`Failed to handle command "${command.meta.name}"`, e);
      throw new Error('Internal server error');
    }

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
