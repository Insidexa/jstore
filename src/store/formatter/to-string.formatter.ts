import { Observable, of } from 'rxjs';

import { FormatterInterface } from './formatter.interface';

export class ToStringFormatter implements FormatterInterface {
  public transform(value: any): Observable<string> {
    return of(value.toString());
  }
}