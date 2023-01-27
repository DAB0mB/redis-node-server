import { command } from './command';
import { del } from './del';
import { get } from './get';
import { set } from './set';
import { Command } from './utils';

const commands = new Map<string, Command>();
commands.set(command.name, command);
commands.set(del.name, del);
commands.set(get.name, get);
commands.set(set.name, set);

export default commands;
