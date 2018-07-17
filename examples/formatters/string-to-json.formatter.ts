import { of, Observable } from 'rxjs';

import { FormatterInterface } from '../../src/index';

export class StringToJSONFormatter implements FormatterInterface {
  public transform(str: string): Observable<any> {
    return of(JSON.parse(str));
  }
}