import { FormatterInterface } from './formatter.interface';

export class StringToJSONFormatter implements FormatterInterface {
  public transform(str: string): any {
    return JSON.parse(str);
  }
}