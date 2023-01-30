import * as command from './command';
import * as del from './del';
import * as expire from './expire';
import * as get from './get';
import * as persist from './persist';
import * as publish from './publish';
import * as save from './save';
import * as set from './set';
import * as subscribe from './subscribe';
import * as ttl from './ttl';
import * as unsubscribe from './unsubscribe';
import { CommandsRecord } from './utils';

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
