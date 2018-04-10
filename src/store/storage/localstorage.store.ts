import { Observable } from 'rxjs';

import { StorageInterface } from './storage.interface';

export class LocalStorage<T> implements StorageInterface<T> {
  constructor(private token: string = 'store') {
  }

  public get(): Observable<any> {
    return Observable.of(localStorage.getItem(this.token));
  }

  public set(value: any): Observable<T | null> {
    localStorage.setItem(this.token, value);
    return Observable.of(value);
  }

  public clear(): Observable<T | null> {
    localStorage.removeItem(this.token);
    return Observable.of(null);
  }

}