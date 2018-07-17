import { Observable } from 'rxjs';

export interface StorageInterface<T> {
  get (): Observable<T>;
  set(value: T): Observable<T>;
  clear(): Observable<T>;
}