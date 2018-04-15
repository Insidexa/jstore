import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { FormatterInterface } from '../../src/index';

export class StringToJSONFormatter implements FormatterInterface {
  public transform(str: string): Observable<any> {
    return of(JSON.parse(str));
  }
}