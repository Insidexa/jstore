import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { FormatterInterface } from './formatter.interface';

export class ToNumberFormatter implements FormatterInterface {
  public transform(str: string): Observable<number> {
    return of(parseInt(str));
  }
}