import { Observable } from 'rxjs/Observable';

export interface FormatterInterface {
  transform(input: any): Observable<any>;
}