export interface ActionEventInterface<T> {
  name: string;
  fn: (value: any) => any;
}