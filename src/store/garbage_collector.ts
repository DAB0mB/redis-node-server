import { kExpiresAt } from './keys';
import { Store } from './store';

export class GarbageCollector {
  private timeouts = new Map<string, NodeJS.Timeout>();
  private started = false;

  constructor(readonly store: Store) {
  }

  start() {
    if (this.started) return false;
    this.started = true;
    this.store.events.on(`set:${kExpiresAt}`, this.onSetExpiresAt);
    this.store.events.on(`delete:${kExpiresAt}`, this.onDeleteExpiresAt);
    this.store.events.on(`delete`, this.onDeleteExpiresAt);
    return true;
  }

  stop() {
    if (!this.started) return false;
    this.started = false;
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
