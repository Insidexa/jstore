import { Snapshot } from './snapshot';
import { ActionInterface } from '../action/action.interface';
import { JStore } from '../../store/jstore';

export class Snapshoter<T> {
  private snapshots: Array<Snapshot<T>> = [];

  public restore(snapshotNameObject: string | Snapshot<T>): Snapshot<T> {
    let snapshot: Snapshot<T> = null;
    if (typeof snapshotNameObject === 'string') {
      const snap = this.snapshots.find((snapshot: Snapshot<T>) => snapshot.getName() === snapshotNameObject);
      if (snap) {
        snapshot = snap;
      } else {
        throw new Error(`Snapshot cannot find by name: ${name}`);
      }
    } else {
      snapshot = snapshotNameObject;
    }

    this.removeSnapshot(snapshot.getName());

    return snapshot;
  }

  public clear(snapshot?: string | Snapshot<T>) {
    if (snapshot) {
      const name = typeof snapshot === 'string' ? snapshot : snapshot.getName();
      this.removeSnapshot(name);
    } else {
      this.snapshots = [];
    }

    return this;
  }

  public make(name: string,
              actions: Array<ActionInterface<T>>,
              store: JStore<T>) {
    const snapshot = new Snapshot(name, store.clone(), actions, new Date());

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