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

// interface User {
//   id: string;
//   username: string;
//   password: string;
// }

export interface CurrentUser {
  id: string;
  accessToken: string;
  userId: string;
  username: string;
  userRole: string;
  expiresIn: number;
}

const { state, config } = createState(withEntities<CurrentUser>());

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

  update(users: CurrentUser[]) {
    store.update(setEntities(users));
  }
}
