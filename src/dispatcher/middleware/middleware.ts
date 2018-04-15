import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export interface MiddlewareInterface<T> {
  next(): Observable<T>;

  getName(): string;
}

export class Middleware<T> implements MiddlewareInterface<T> {
  public constructor(private readonly name: string) {}

  public getName(): string {
    return this.name;
  }

  public next(): Observable<T> {
    return of();
  }
}