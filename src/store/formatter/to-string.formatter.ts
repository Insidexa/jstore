import { FormatterInterface } from './formatter.interface';
import { Observable } from 'rxjs/Observable';

export class ToStringFormatter implements FormatterInterface {
  public transform(value: any): Observable<string> {
    return Observable.of(value.toString());
  }
}