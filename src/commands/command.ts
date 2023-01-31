import { CommandNotImplementedError } from '~/utils/errors';
import * as commandDocs from './command_docs';

export const meta = {
  name: 'command',
  summary: 'Get array of Redis command details',
  group: 'server',
  complexity: 'O(N) where N is the total number of Redis commands',
};

export const subcommands = {
  docs: commandDocs,
};

export function handler() {
  return new CommandNotImplementedError(meta.name);
}
