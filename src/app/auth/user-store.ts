import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  selectAllEntities,
  setEntities,
} from '@ngneat/elf-entities';
import {
  persistState,
  sessionStorageStrategy,
} from '@ngneat/elf-persist-state';

interface User {
  id: number;
  username: string;
  password: string;
}
const { state, config } = createState(withEntities<User>());

const store = new Store({ name: 'users', state, config });

export const persist = persistState(store, {
  key: 'currentUser',
  storage: sessionStorageStrategy,
  source: () => store.pipe(debounceTime(1000)),
});

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  users$ = store.pipe(selectAllEntities());

  update(users: User[]) {
    store.update(setEntities(users));
  }
}
