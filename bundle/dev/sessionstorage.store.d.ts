import { Observable } from 'rxjs/Observable';
import { StorageInterface } from '../src/index';
export declare class SessionStorage<T> implements StorageInterface<T> {
    private token;
    constructor(token?: string);
    get(): Observable<any>;
    set(value: any): Observable<T | null>;
    clear(): Observable<T | null>;
}
