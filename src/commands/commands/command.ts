import { CommandNotImplementedError } from '~/utils/errors';
import { docs } from './command_docs';
import { Command } from '../command';

export const command: Command = {
  meta: {
    name: 'command',
    summary: 'Get array of Redis command details',
    group: 'server',
    complexity: 'O(N) where N is the total number of Redis commands',
  },

  subcommands: {
    docs,
  },

  handler() {
    return new CommandNotImplementedError(command.meta.name);
  },
};
