import { Observable, of } from 'rxjs';

import { FormatterInterface } from './formatter.interface';

export class TrimFormatter implements FormatterInterface {
  public transform(str: string): Observable<string> {
    return of(str.trim());
  }
}