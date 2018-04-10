export type ActionFn<T> = (value: T) => T;

export type MakeAction = <T>(name: string, fn: Function) => Action<T>;

export interface Action<T> {
  name: string;
  fn: ActionFn<T>;
}