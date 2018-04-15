import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { switchMap, mergeScan, last, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { StorageInterface } from './storage/storage.interface';
import { SimpleStorage } from './storage/simple.storage';
import { StoreConfigInterface } from './store-config.interface';
import { FormatterInterface } from './formatter/formatter.interface';
import { StrictTypeException } from './exceptions/strict-type.exception';
import { JStoreConfResolver } from './config-resolver';
import { getType } from './get-type';
import { RunContext } from './run-context';
import { observable } from 'rxjs/symbol/observable';

export const $$storage = Symbol('$$storage');
export const $$clone = Symbol('$$clone');

export class JStore<T> {
  private store: Subject<T> = new Subject<T>();
  private store$: Observable<T> = this.store.asObservable();

  private storage: StorageInterface<T> = new SimpleStorage<T>();

  private inputFormatters: FormatterInterface[] = [];
  private outputFormatters: FormatterInterface[] = [];

  private strict: boolean = true;
  private prevType: string;
  private prevValue: T;

  private context: RunContext = null;

  constructor(private config?: StoreConfigInterface<T>) {
    if (config) {
      const {
        storage,
        inputFormatters,
        outputFormatters,
        strictTypeCheck,
        initValue
      } = JStoreConfResolver(config);

      this.storage = storage;
      this.inputFormatters = inputFormatters;
      this.outputFormatters = outputFormatters;
      this.strict = strictTypeCheck;
      if (initValue) {
        this.prevValue = initValue;
        this.prevType = getType(initValue);
        this.dispatch(initValue);
      }
    }
  }

  public changeContext(context: RunContext): JStore<T> {
    this.context = context;

    return this;
  }

  public observable(): Observable<T> {
    return this.store$.pipe(
      switchMap(this.checkOutputFormatters.bind(this))
    );
  }

  public dispatch(value: T): Subscription {
    const type = getType(value);
    const typeFail = this.strict && this.prevType && this.prevType !== type;
    if (typeFail) {
      throw new StrictTypeException();
    }

    return this.checkInputFormatters(value).subscribe((formattedValue) => {
      return this.storage.set(formattedValue)
        .subscribe((storeValue: T) => {
          this.prevType = type;
          this.prevValue = storeValue;
          this.runMaybeWithContext(storeValue);
        });
    });
  }

  public subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.observable()
      .subscribe(next, error, complete);
  }

  public destroy(subscription?: Subscription): void {
    return this.storage.clear()
      .subscribe(() => {
        if (subscription) {
          subscription.unsubscribe();
        }
        this.store.complete();
      })
      .unsubscribe();
  }

  /**
   * Ony for JStoreDispatcher
   *
   */
  public [$$clone](): JStore<T> {
    const prototype = Object.getPrototypeOf(this.storage);
    const store = Object.create(prototype);
    const storage = Object.assign(store, this.storage);
    const inputFormatters = this.inputFormatters;
    const outputFormatters = this.outputFormatters;
    const strictTypeCheck = this.strict;
    const initValue = this.config && this.config.initValue ? this.prevValue : null;

    let config: StoreConfigInterface<T> = {
      storage,
      inputFormatters,
      outputFormatters,
      strictTypeCheck
    };

    if (initValue) {
      config.initValue = initValue;
    }

    return new JStore<T>(config);
  }

  public [$$storage](): Observable<T> {
    return this.storage.get()
      .pipe(
        switchMap(this.checkOutputFormatters.bind(this))
      );
  }

  private checkInputFormatters(value: T): Observable<T> {
    return this.formatValue(this.inputFormatters, value);
  }

  private checkOutputFormatters(value: T): Observable<T> {
    return this.formatValue(this.outputFormatters, value);
  }

  private formatValue(formatters: FormatterInterface[], value: T): Observable<T> {
    if (formatters.length === 0) {
      return of(value);
    }

    return of(...formatters)
      .pipe(
        mergeScan((value: T, formatter: FormatterInterface) => formatter.transform(value), value),
        last()
      );
  }

  private runMaybeWithContext(value: T) {
    if (this.context) {
      this.context(() => this.store.next(value));
    } else {
      this.store.next(value);
    }
  }
}