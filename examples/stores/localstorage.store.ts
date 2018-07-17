import { of, Observable } from 'rxjs';

import { StorageInterface } from '@jashkasoft/rx-jstore';

export class LocalStorage<T> implements StorageInterface<T> {
  constructor(private token: string = 'store') {
  }

  public get(): Observable<any> {
    return of(localStorage.getItem(this.token));
  }

  public set(value: any): Observable<T | null> {
    localStorage.setItem(this.token, value);
    return of(value);
  }

  public clear(): Observable<T | null> {
    localStorage.removeItem(this.token);
    return of(null);
  }

}