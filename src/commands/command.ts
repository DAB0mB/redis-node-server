import { CommandNotImplementedError } from 'src/errors';
import * as commandDocs from './commandDocs';

export const meta = {
  name: 'command',
  summary: 'Get array of Redis command details',
  since: '1.0.0',
  group: 'server',
  complexity: 'O(N) where N is the total number of Redis commands',
};

export const subCommands = {
  docs: commandDocs,
};

export function handler() {
  return new CommandNotImplementedError('command');
};
