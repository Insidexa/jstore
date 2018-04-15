import { Observable } from 'rxjs/Observable';
import { StorageInterface } from './storage.interface';
/**
 * Http storage created with promises for sync with backend
 */
export declare class HttpStorage<T> implements StorageInterface<T> {
    private value;
    get(): Observable<T | null>;
    set(value: T | null): Observable<T | null>;
    clear(): Observable<T | null>;
}
