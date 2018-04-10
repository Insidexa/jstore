import { FormatterInterface } from './formatter.interface';
import { Observable } from 'rxjs/Observable';

export class ToNumberFormatter implements FormatterInterface {
  public transform(str: string): Observable<number> {
    return Observable.of(parseInt(str));
  }
}