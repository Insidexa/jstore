export type ActionFn<T> = (value: T) => T;

export interface Action<T> {
  name: string;
  fn: ActionFn<T>;
}