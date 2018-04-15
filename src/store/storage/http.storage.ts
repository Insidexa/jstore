import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';

import { StorageInterface } from './storage.interface';

/**
 * Http storage created with promises for sync with backend
 */
export class HttpStorage<T> implements StorageInterface<T> {
  private value: T = null;

  public get(): Observable<T | null> {
    return fromPromise(new Promise((resolve) => {
      return resolve(this.value);
    }));
  }

  public set(value: T | null): Observable<T | null> {
    return fromPromise(new Promise((resolve) => {
      this.value = value;
      return resolve(this.value);
    }));
  }

  public clear(): Observable<T | null> {
    return fromPromise(new Promise((resolve) => {
      this.value = null;
      return resolve(this.value);
    }));
  }

}