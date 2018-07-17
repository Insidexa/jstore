import { of, Observable } from 'rxjs';

import { FormatterInterface } from '@jashkasoft/rx-jstore';

export class StringToJSONFormatter implements FormatterInterface {
  public transform(str: string): Observable<any> {
    return of(JSON.parse(str));
  }
}