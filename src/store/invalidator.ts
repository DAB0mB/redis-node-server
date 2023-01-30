import { kExpiresAt } from './keys';
import { Store } from './store';

export class Invalidator {
  private timeouts = new Map<string, NodeJS.Timeout>();
  private watching = false;

  constructor(readonly store: Store) {
  }

  watch() {
    if (this.watching) return false;
    this.watching = true;
    this.store.events.on(`set:${kExpiresAt}`, this.onSetExpiresAt);
    this.store.events.on(`delete:${kExpiresAt}`, this.onDeleteExpiresAt);
    this.store.events.on(`delete`, this.onDeleteExpiresAt);
    return true;
  }

  unwatch() {
    if (!this.watching) return false;
    this.watching = false;
    this.store.events.off(`set:${kExpiresAt}`, this.onSetExpiresAt);
    this.store.events.off(`delete:${kExpiresAt}`, this.onDeleteExpiresAt);
    this.store.events.off(`delete`, this.onDeleteExpiresAt);
    return true;
  }

  private onSetExpiresAt = (key: string, expiresAt: number) => {
    const timeout = setTimeout(() => {
      this.store.delete(key);
    }, expiresAt - Date.now());
    this.timeouts.set(key, timeout);
  };

  private onDeleteExpiresAt = (key: string) => {
    const timeout = this.timeouts.get(key);
    clearTimeout(timeout);
    this.timeouts.delete(key);
  };
}
