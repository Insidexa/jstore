import { Observable } from 'rxjs/Observable';

export type ActionFn<T> = (value: T) => Observable<T> | T;

export interface Action<T> {
  name: string;
  fn: ActionFn<T>;
}

export interface ActionData<T> extends Action<T> {
  value?: T;
}