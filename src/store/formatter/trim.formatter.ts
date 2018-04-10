import { FormatterInterface } from './formatter.interface';

export class TrimFormatter implements FormatterInterface {
  public transform(str: string): string {
    return str.trim();
  }
}