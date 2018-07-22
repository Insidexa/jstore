import { Observable } from 'rxjs';
import { Middleware } from '../middleware/middleware';

export type ActionFn<T> = (value: T, payload: any, middlewareData?: any) => Observable<T> | T;

export interface Action<T> {
  name: string;
  fn: ActionFn<T>;
  middleware: Middleware | null;
}

export interface ActionData<T> extends Action<T> {
  value?: T;
}