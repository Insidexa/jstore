import { FormatterInterface } from './formatter.interface';
import { Observable } from 'rxjs/Observable';

export class TrimFormatter implements FormatterInterface {
  public transform(str: string): Observable<string> {
    return Observable.of(str.trim());
  }
}