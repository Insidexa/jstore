import { FormatterInterface } from './formatter.interface';

export class JSONToStringFormatter implements FormatterInterface {
  public transform(json: any): string {
    return JSON.stringify(json);
  }
}