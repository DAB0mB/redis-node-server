import { Invalidator } from './invalidator';
import { Store } from './store';

export const store = new Store({
  dumpPath: process.env.DUMP_PATH,
});
export const invalidator = new Invalidator(store);
invalidator.watch();
