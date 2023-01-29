import { Invalidator } from './invalidator';
import { Store } from './store';

export const store = new Store();
export const invalidator = new Invalidator(store);
invalidator.watch();
