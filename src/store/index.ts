import { resolve } from 'path';
import { error, log } from 'src/console';
import { Invalidator } from './invalidator';
import { Persistor } from './persistor';
import { Store } from './store';

const dumpPath = process.env.DUMP_PATH || resolve(process.cwd(), 'dump.json');
const autoSaveInterval = Number(process.env.AUTO_SAVE_INTERVAL || '60');

export const store = new Store();
export const invalidator = new Invalidator(store);
export const persistor = new Persistor(store, dumpPath, autoSaveInterval);

invalidator.watch();
persistor.autoSave();

persistor.events.on('autoSave', () => {
  log('auto saved');
});

persistor.events.on('autoSave:error', (e) => {
  error('auto save error', e);
});
