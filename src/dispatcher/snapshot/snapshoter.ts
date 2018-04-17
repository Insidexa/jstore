import { Snapshot } from './snapshot';
import { ActionData } from '../action/action';
import { $$clone, JStore } from '../../store/jstore';

export class Snapshoter<T> {
  private snapshots: Array<Snapshot<T>> = [];

  public restore(snapshot: Snapshot<T>): Snapshot<T> {
    this.removeSnapshot(snapshot.getName());

    return snapshot;
  }

  public clear(snapshot?: Snapshot<T>) {
    if (snapshot) {
      const name = snapshot.getName();
      this.removeSnapshot(name);
    } else {
      this.snapshots = [];
    }

    return this;
  }

  public make(name: string,
              actions: Array<ActionData<T>>,
              store: JStore<T>) {
    const snapshot = new Snapshot(name, <JStore<T>>store[$$clone](), actions, new Date());

    this.snapshots.push(snapshot);

    return snapshot;
  }

  public getSnapshots(): Array<Snapshot<T>> {
    return this.snapshots;
  }

  private removeSnapshot(name: string) {
    this.snapshots = this.snapshots.filter((snapshot: Snapshot<T>) => snapshot.getName() !== name);

    return this;
  }
}