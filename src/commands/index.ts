import { command } from './command';
import { del } from './del';
import { expire } from './expire';
import { get } from './get';
import { persist } from './persist';
import { save } from './save';
import { set } from './set';
import { ttl } from './ttl';
import { Command } from './utils';

export const commands = new Map<string, Command>();
commands.set(command.name, command);
commands.set(del.name, del);
commands.set(expire.name, expire);
commands.set(get.name, get);
commands.set(persist.name, persist);
commands.set(save.name, save);
commands.set(set.name, set);
commands.set(ttl.name, ttl);
