import { FormatterInterface } from './formatter.interface';
import { Observable } from 'rxjs/Observable';

export class StringToJSONFormatter implements FormatterInterface {
  public transform(str: string): Observable<any> {
    return Observable.of(JSON.parse(str));
  }
}