import { command } from './command';
import { Command } from './utils';

const commands = new Map<string, Command>();
commands.set(command.name, command);

export default commands;
