import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { FormatterInterface } from './formatter.interface';

export class ToStringFormatter implements FormatterInterface {
  public transform(value: any): Observable<string> {
    return of(value.toString());
  }
}