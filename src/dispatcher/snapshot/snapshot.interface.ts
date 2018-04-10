import { Snapshot } from './snapshot';

export interface SnapshotInterface<T> {
  snapshot: Snapshot<T>;
  name: string;
}