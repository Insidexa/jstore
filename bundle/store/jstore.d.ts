import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StoreConfigInterface } from './store-config.interface';
import { FormatterInterface } from './formatter/formatter.interface';
import { RunContext } from './run-context';
export declare const $$storage: unique symbol;
export declare const $$clone: unique symbol;
export declare class JStore<T> {
    private config;
    private store;
    private store$;
    private storage;
    private inputFormatters;
    private outputFormatters;
    private strict;
    private prevType;
    private prevValue;
    private context;
    constructor(config?: StoreConfigInterface<T>);
    changeContext(context: RunContext): JStore<T>;
    observable(): Observable<T>;
    dispatch(value: T): Subscription;
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    destroy(subscription?: Subscription): void;
    setInputFormatters(formatters: FormatterInterface[]): JStore<T>;
    setOutputFormatters(formatters: FormatterInterface[]): JStore<T>;
    /**
     * Ony for JStoreDispatcher
     *
     */
    [$$clone](): JStore<T>;
    [$$storage](): Observable<T>;
    private checkInputFormatters(value);
    private checkOutputFormatters(value);
    private formatValue(formatters, value);
    private runMaybeWithContext(value);
}
