import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { JStore, $$storage } from '../store/jstore';
import { Snapshot } from './snapshot/snapshot';
import { ActionListener } from './action/action-event.interface';
import { Action, ActionFn, ActionData } from './action/action';
import { Snapshoter } from './snapshot/snapshoter';
import { JStoreDispatcherError } from './dispatcher-locked.error';
import { deepCopy } from '../deep-copy';

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
  private actionHistory: Array<ActionData<T>> = [];
  private actionListeners: Array<ActionListener<T>> = [];
  private isLock: boolean = false;

  private LOCK_ACTION: Action<T> = JStoreDispatcher.makeAction<null>('LOCK_ACTION$', () => null);
  private UNLOCK_ACTION: Action<T> = JStoreDispatcher.makeAction<null>('UNLOCK_ACTION$', () => null);

  constructor(private store?: JStore<T>) {
    if (!this.store) {
      this.store = new JStore<T>();
    }
  }

  public action(action: Action<T>): JStoreDispatcher<T> {
    this.throwIfLock();

    this.runAction(action)
      .subscribe((data: ActionData<T>) => {
        this.actionHistory.push(data);
        this.pushReactions(data);
      })
      .unsubscribe();

    return this;
  }

  public on(action: Action<T>, fn: (value: T) => void): () => void {
    this.actionListeners.push({
      name: action.name,
      fn: fn.bind(this)
    });

    return () => {
      this.actionListeners = this.actionListeners.filter((action: ActionListener<T>) => action.name !== action.name);
    };
  }

  public restoreSnapshot(snapshotObject: Snapshot<T>): Snapshot<T> {
    this.throwIfLock();

    const snapshot = this.snapshoter.restore(snapshotObject);
    const actions = snapshot.getActions();
    actions.forEach((action: ActionData<T>) => {
      this.actionHistory.push(action);
    });

    if (actions.length > 0) {
      this.store.dispatch(actions[actions.length - 1].value);
    }

    return snapshot;
  }

  public makeSnapshot(name: string, clearActions: boolean = false): Snapshot<T> {
    const actions = deepCopy<Array<ActionData<T>>>(this.actionHistory);
    const snapshot = this.snapshoter.make(name, actions, this.store);

    if (clearActions) {
      this.actionHistory = [];
    }

    return snapshot;
  }

  public lock(): JStoreDispatcher<T> {
    this.throwIfLock();

    this.isLock = true;
    this.actionHistory.push(this.LOCK_ACTION);

    return this;
  }

  public unlock(): JStoreDispatcher<T> {
    if (!this.isLock) {
      throw new JStoreDispatcherError('Dispatcher unlocked');
    }
    this.isLock = false;
    this.actionHistory.push(this.UNLOCK_ACTION);

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

  private pushReactions(data: ActionData<T>): void {
    const length = this.actionListeners.length;
    for (let i = 0; i < length; ++i) {
      const event = this.actionListeners[i];
      if (event.name === data.name) {
        event.fn.bind(this)(data.value, () => {
          this.actionListeners.splice(i, 0);
        });
      }
    }
  }

  private runAction(action: Action<T>): Observable<ActionData<T>> {
    return (this.store[$$storage]() as Observable<T>)
      .pipe(
        map(value => action.fn.bind(this)(value)),
        switchMap(observableOrValue => {
          if (!(observableOrValue instanceof Observable)) {
            return of(observableOrValue);
          }
          return observableOrValue;
        }),
        map((value: T) => {
          this.store.dispatch(value);
          const { name, fn } = action;

          return {name, value, fn};
        })
      );
  }

  private throwIfLock() {
    if (this.isLocked()) {
      throw new JStoreDispatcherError('Dispatcher locked. Unlock to continue');
    }
  }
}