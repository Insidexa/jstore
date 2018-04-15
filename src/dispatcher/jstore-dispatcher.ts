import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { $$storage, JStore } from '../store/jstore';
import { Snapshot } from './snapshot/snapshot';
import { ActionInterface } from './action/action.interface';
import { ActionEventInterface } from './action/action-event.interface';
import { Action, ActionFn } from './action/action';
import { Snapshoter } from './snapshot/snapshoter';
import { JStoreDispatcherError } from './dispatcher-locked.error';
import { ReactionDataInterface } from './reaction-data.interface';

type DestroyFn<T> = (value: T, destroy: () => void) => void;

/**
 * TODO: add store for store all snapshots & actions & store
 *
 * TODO: add filters for collection store
 *
 * TODO: add middleware with before
 *       before maybe with result: boolean
 *       before maybe pass value in action
 *       false -> action not called
 *       true -> called
 *
 */
export class JStoreDispatcher<T> {

  private snapshoter: Snapshoter<T> = new Snapshoter<T>();
  private actions: Array<ActionInterface<T>> = [];
  private isLock: boolean = false;
  private actionEvents: Array<ActionEventInterface<T>> = [];

  private NAME_LOCK: string = 'LOCK_ACTION$';
  private NAME_UNLOCK: string = 'UNLOCK_ACTION$';

  constructor(private store?: JStore<T>) {
    if (!this.store) {
      this.store = new JStore<T>();
    }
  }

  public action(action: Action<T>): JStoreDispatcher<T> {
    if (this.isLock) {
      throw new JStoreDispatcherError('Dispatcher locked. Unlock to continue');
    }

    this.runAction(action)
      .subscribe((data: ReactionDataInterface<T>) => {
        this.pushReactions(data);
      })
      .unsubscribe();

    return this;
  }

  public on(action: Action<T>, fn: DestroyFn<T>): JStoreDispatcher<T> {
    this.actionEvents.push({
      name: action.name,
      fn: fn.bind(this)
    });

    return this;
  }

  public restoreSnapshot(snapshotObject: Snapshot<T>): Snapshot<T> {
    const snapshot = this.snapshoter.restore(snapshotObject);
    const actions = snapshot.getActions();
    actions.forEach((action: ActionInterface<T>) => {
      this.actions.push(action);
      this.store.dispatch(action.value);
    });

    return snapshot;
  }

  public makeSnapshot(name: string, clearActions: boolean = false): Snapshot<T> {
    const actions = this.actions;
    const snapshot = this.snapshoter.make(name, actions, this.store);

    if (clearActions) {
      this.actions = [];
    }

    return snapshot;
  }

  public clearSnapshots(snapshot?: Snapshot<T>): JStoreDispatcher<T> {
    this.snapshoter.clear(snapshot);

    return this;
  }

  public lock(): JStoreDispatcher<T> {
    if (this.isLock) {
      throw new JStoreDispatcherError('Dispatcher locked');
    }

    this.isLock = true;
    this.actions.push({
      name: this.NAME_LOCK,
      value: null
    });

    return this;
  }

  public unlock(): JStoreDispatcher<T> {
    if (!this.isLock) {
      throw new JStoreDispatcherError('Dispatcher unlocked');
    }
    this.isLock = false;
    this.actions.push({
      name: this.NAME_UNLOCK,
      value: null
    });

    return this;
  }

  public isLocked(): boolean {
    return this.isLock;
  }

  public static makeAction<T>(name: string, fn: ActionFn<T>): Action<T> {
    return {
      name,
      fn
    };
  }

  private pushReactions(data: ReactionDataInterface<T>): void {
    const length = this.actionEvents.length;
    for (let i = 0; i < length; ++i) {
      const event = this.actionEvents[i];
      if (event.name === data.name) {
        event.fn.bind(this)(data.value, () => {
          this.actionEvents.splice(i, 0);
        });
      }
    }
  }

  private runAction(action: Action<T>): Observable<ReactionDataInterface<T>> {
    return (this.store[$$storage]() as Observable<T>)
      .pipe(map((value: T) => {
        value = action.fn.bind(this)(value);
        this.store.dispatch(value);
        const name = action.name;

        return {name, value};
      }));
  }
}