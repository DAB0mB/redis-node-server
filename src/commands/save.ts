import { store } from 'src/store';

let saving: Promise<void>;

export async function save() {
  saving ??= store.dump().finally(() => saving = undefined);
  await saving;
  return 'OK';
}
