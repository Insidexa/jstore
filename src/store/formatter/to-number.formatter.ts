import { FormatterInterface } from './formatter.interface';

export class ToNumberFormatter implements FormatterInterface {
  public transform(str: string): number {
    return parseInt(str);
  }
}