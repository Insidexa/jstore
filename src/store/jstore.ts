import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StorageInterface } from './storage/storage.interface';
import { SimpleStorage } from './storage/simple.storage';
import { StoreConfigInterface } from './store-config.interface';
import { FormatterInterface } from './formatter/formatter.interface';
import { StrictTypeException } from './exceptions/strict-type.exception';
import { JStoreConfResolver } from './config-resolver';
import { getType } from './get-type';
import { map, concatMap, switchMap, mergeScan, last, combineAll } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

export class JStore<T> {
  private store: Subject<T> = new Subject<T>();
  private store$: Observable<T> = this.store.asObservable();

  private storage: StorageInterface<T> = new SimpleStorage<T>();

  private inputFormatters: FormatterInterface[] = [];
  private outputFormatters: FormatterInterface[] = [];

  private strict: boolean = true;
  private prevType: string;

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
        this.prevType = getType(initValue);
        this.dispatch(initValue);
      }
    }
  }

  /**
   * Ony for JStoreDispatcher
   *
   * @return {JStore<T>}
   */
  public clone(): JStore<T> {
    const prototype = Object.getPrototypeOf(this.storage);
    const store = Object.create(prototype);
    const storage = Object.assign(store, this.storage);
    const inputFormatters = this.inputFormatters;
    const outputFormatters = this.outputFormatters;
    const strictTypeCheck = this.strict;
    const initValue = this.storage.cachedValue();

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

  public check(): Subscription {
    return this.storage.get()
      .subscribe((value: T) => {
        this.store.next(value);

        return value;
      });
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
          this.store.next(storeValue);

          return storeValue;
        });
    });
  }

  public getStorage(): Observable<T> {
    return this.storage.get()
      .pipe(
        switchMap(this.checkOutputFormatters.bind(this))
      );
  }

  public value(): Observable<T> {
    return this.store$.pipe(
      switchMap(this.checkOutputFormatters.bind(this))
    );
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

  public setInputFormatters(formatters: FormatterInterface[]): JStore<T> {
    this.inputFormatters = formatters;

    return this;
  }

  public setOutputFormatters(formatters: FormatterInterface[]): JStore<T> {
    this.outputFormatters = formatters;

    return this;
  }


  private checkInputFormatters(value: T): Observable<T> {
    return this.formatValue(this.inputFormatters, value);
  }

  private checkOutputFormatters(value: T): Observable<T> {
    return this.formatValue(this.outputFormatters, value);
  }

  private formatValue(formatters: FormatterInterface[], value: T): any {
    if (formatters.length === 0) {
      return Observable.of(value);
    }

    return of(...formatters)
      .pipe(
        mergeScan((value: any, formatter: any) => (formatter as FormatterInterface).transform(value), value),
        last()
      );
  }
}