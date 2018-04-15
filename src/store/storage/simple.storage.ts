import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { StorageInterface } from './storage.interface';

export class SimpleStorage<T> implements StorageInterface<T> {
  private value: T = null;

  public get(): Observable<T | null> {
    return of(this.value);
  }

  public set(value: T | null): Observable<T | null> {
    this.value = value;
    return of(this.value);
  }

  public clear(): Observable<T | null> {
    this.value = null;
    return of(this.value);
  }

}