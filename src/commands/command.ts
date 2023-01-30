import { UnknownCommandError } from 'src/errors';
import { commandDocs } from './commandDocs';

command.subCommands = {
  docs: commandDocs,
};

export function command() {
  return new UnknownCommandError('command');
};
