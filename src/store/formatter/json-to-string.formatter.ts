import { FormatterInterface } from './formatter.interface';
import { Observable } from 'rxjs/Observable';

export class JSONToStringFormatter implements FormatterInterface {
  public transform(json: any): Observable<string> {
    return Observable.of(JSON.stringify(json));
  }
}