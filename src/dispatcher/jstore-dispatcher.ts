import { Observable } from 'rxjs/Observable';

import { JStore } from '../store/jstore';
import { Snapshot } from './snapshot/snapshot';
import { ActionInterface } from './action/action.interface';
import { ActionEventInterface } from './action/action-event.interface';
import { Action } from './action/action';
import { Snapshoter } from './snapshot/snapshoter';
import { JStoreDispatcherError } from './dispatcher-locked.error';
import { ReactionDataInterface } from './reaction-data.interface';

type JSDAction<T> = string | Action<T>;
type DestroyFn<T> = (value: T, destroy: () => void) => void;

/**
 * TODO: add store for store all snapshots & actions & store
 *
 * TODO: add filters for collection store
 *
 * TODO: replace on to middleware with ( before and after )
 *       before maybe with result: boolean
 *       before maybe pass value in action
 *       false -> action not called
 *       true -> called
 *
 * TODO: add named subscription
 *       example:
 *         dispatcher.add('listenerInComponent') // for what
 *         dispatcher.makeSub('listenerInComponent').subscribe....
 *         dispatcher.completeSub('listenerInComponent')
 */
export class JStoreDispatcher<T> {

  private snapshoter: Snapshoter<T> = new Snapshoter<T>();
  private actions: Array<ActionInterface<T>> = [];
  private isLock: boolean = false;
  private actionEvents: Array<ActionEventInterface<T>> = [];

  private NAME_LOCK: string = 'LOCK_ACTION$';
  private NAME_UNLOCK: string = 'UNLOCK_ACTION$';

  constructor(private store: JStore<T>) {}

  public action(action: JSDAction<T>, value?: T): JStoreDispatcher<T> {
    if (this.isLock) {
      throw new JStoreDispatcherError('Dispatcher locked. Unlock to continue');
    }

    switch (typeof action) {
      case 'string':
        const actionName = <string>action;
        const data = this.actionFromName(actionName, value);
        this.pushReactions(data);
        break;
      case 'object':
        this.actionFromObject(<Action<T>>action)
          .subscribe((data: ReactionDataInterface<T>) => {
            this.pushReactions(data);
          })
          .unsubscribe();

        break;
    }

    return this;
  }

  public on(action: JSDAction<T>, fn: DestroyFn<T>): JStoreDispatcher<T> {
    switch (typeof action) {
      case 'string':
        const name = <string>action;
        this.actionEvents.push({
          name: name,
          fn: fn.bind(this)
        });
        break;

      case 'object':
        this.actionEvents.push({
          name: (action as Action<T>).name,
          fn: fn.bind(this)
        });
        break;
    }

    return this;
  }

  public restoreSnapshot(snapshotNameObject: string | Snapshot<T>): Snapshot<T> {
    const snapshot = this.snapshoter.restore(snapshotNameObject);
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

  public clearSnapshots(snapshot?: string | Snapshot<T>): JStoreDispatcher<T> {
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

  private actionFromName(name: string, value: T): ReactionDataInterface<T> {
    const action = {name, value};
    this.actions.push(action);
    this.store.dispatch(value);

    return {name, value};
  }

  private actionFromObject(action: Action<T>): Observable<ReactionDataInterface<T>> {
    return this.store.getStorage().map((value: T) => {
      value = action.fn.bind(this)(value);
      this.store.dispatch(value);
      const name = action.name;

      return {name, value};
    });
  }
}