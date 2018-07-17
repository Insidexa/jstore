import { Observable } from 'rxjs';

export interface FormatterInterface {
  transform(input: any): Observable<any>;
}