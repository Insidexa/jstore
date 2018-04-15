import { Observable } from 'rxjs/Observable';
import { StorageInterface } from './storage.interface';
export declare class SimpleStorage<T> implements StorageInterface<T> {
    private value;
    get(): Observable<T | null>;
    set(value: T | null): Observable<T | null>;
    clear(): Observable<T | null>;
}
