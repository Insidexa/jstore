import { Snapshoter } from './snapshot/snapshoter';
import { Action } from './action/action';
import { ActionListener } from './action/action-event.interface';
import { JStore } from '../store/jstore';

export interface DispatcherStoreInterface<T> {
  store: JStore<T>;
  snapshoter: Snapshoter<T>;
  actions: Array<Action<T>>;
  actionEvents: Array<ActionListener<T>>;

  isLock: boolean;
}