import { Observable, of } from 'rxjs';

import { FormatterInterface } from './formatter.interface';

export class ToNumberFormatter implements FormatterInterface {
  public transform(str: string): Observable<number> {
    return of(parseInt(str));
  }
}