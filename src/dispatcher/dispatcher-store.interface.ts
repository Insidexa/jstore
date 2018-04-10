import { Snapshoter } from './snapshot/snapshoter';
import { ActionInterface } from './action/action.interface';
import { ActionEventInterface } from './action/action-event.interface';
import { JStore } from '../store/jstore';

export interface DispatcherStoreInterface<T> {
  store: JStore<T>;
  snapshoter: Snapshoter<T>;
  actions: Array<ActionInterface<T>>;
  actionEvents: Array<ActionEventInterface<T>>;

  isLock: boolean;
}