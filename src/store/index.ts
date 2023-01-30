import { resolve } from 'path';
import { Invalidator } from './invalidator';
import { Persistor } from './persistor';
import { Store } from './store';

const dumpPath = process.env.DUMP_PATH || resolve(process.cwd(), 'dump.json');

export const store = new Store();
export const invalidator = new Invalidator(store);
export const persistor = new Persistor(store, dumpPath);

invalidator.watch();
