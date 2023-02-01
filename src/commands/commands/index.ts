import { CommandsRecord } from '~/commands/command';
import { command } from './command';
import { del } from './del';
import { expire } from './expire';
import { get } from './get';
import { persist } from './persist';
import { publish } from './publish';
import { save } from './save';
import { set } from './set';
import { subscribe } from './subscribe';
import { ttl } from './ttl';
import { unsubscribe } from './unsubscribe';

export const commands: CommandsRecord = {
  command,
  del,
  expire,
  get,
  persist,
  publish,
  save,
  set,
  subscribe,
  ttl,
  unsubscribe,
};
