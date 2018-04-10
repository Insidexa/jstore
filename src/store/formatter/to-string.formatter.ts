import { FormatterInterface } from './formatter.interface';

export class ToStringFormatter implements FormatterInterface {
  public transform(value: any): string {
    return value.toString();
  }
}