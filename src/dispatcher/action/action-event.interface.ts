export interface ActionEvent<T> {
  name: string;
  fn: (value: any) => any;
}