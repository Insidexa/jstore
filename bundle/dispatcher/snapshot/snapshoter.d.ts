import { Snapshot } from './snapshot';
import { ActionInterface } from '../action/action.interface';
import { JStore } from '../../store/jstore';
export declare class Snapshoter<T> {
    private snapshots;
    restore(snapshot: Snapshot<T>): Snapshot<T>;
    clear(snapshot?: Snapshot<T>): this;
    make(name: string, actions: Array<ActionInterface<T>>, store: JStore<T>): Snapshot<T>;
    getSnapshots(): Array<Snapshot<T>>;
    private removeSnapshot(name);
}
