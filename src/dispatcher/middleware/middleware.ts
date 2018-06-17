import { Observable } from 'rxjs/Observable';
import { Action } from '../action/action';

export interface MiddlewareData<T> {
  value: T;
  action: Action<T>;
}

export interface Middleware {
  next<T>(data: MiddlewareData<T>): Observable<any>;
}