export interface ActionListener<T> {
  name: string;
  fn: (value: any) => any;
}