import { Observable } from 'rxjs/Observable';

export interface Middleware {
  next(): Observable<any>;
}