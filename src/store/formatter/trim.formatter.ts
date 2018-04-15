import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { FormatterInterface } from './formatter.interface';

export class TrimFormatter implements FormatterInterface {
  public transform(str: string): Observable<string> {
    return of(str.trim());
  }
}