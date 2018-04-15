import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { FormatterInterface } from '../../src/index';

export class JSONToStringFormatter implements FormatterInterface {
  public transform(json: any): Observable<string> {
    return of(json)
      .pipe(
        map(json => JSON.stringify(json))
      );
  }
}