import { forkJoin } from 'rxjs';

import {
  JStore,
  storeFactory,
  TrimFormatter,
  RunContext,
} from '../src/index';

import { LocalStorage } from './stores/localstorage.store';
import { JSONToStringFormatter } from './formatters/json-to-string.formatter';
import { StringToJSONFormatter } from './formatters/string-to-json.formatter';
import { testDispatcher } from './dispatcher';

function example_storeFactory_context_number() {
  console.group('Example: storeFactory, context with number');
  /**
   * store factory
   */
  const store = storeFactory<number>();
  const sub = store.subscribe((n: number) => {
    console.log('number', n);
  });

  function youContext(fn: Function) {
    fn();
  }

  store.changeContext((fn: RunContext) => youContext(fn));
  store.dispatch(100000000);

  console.log('snapshot with value', store.snapshot());

  store.destroy(sub);

  console.groupEnd();
}

function example_initValue_formatters() {
  console.group('Example: initValue string, formatters ( trim )');
  /**
   *
   * trim formatter & init value
   */
  const storeString = new JStore<string>({
    initValue: '   asd asd        ',
    inputFormatters: [
      new TrimFormatter()
    ]
  });

  const subscriptionString = storeString.subscribe((value: string) => {
    console.log('storeString', `'${value}'`);
  });

  storeString.dispatch('a    ');
  storeString.dispatch('     b');

  storeString.dispatch('ac c');
  storeString.dispatch('asd');
  storeString.dispatch('    asdasd asd asd ');

// complete store & unsubscribe onChange
  storeString.destroy(subscriptionString);
  console.groupEnd();
}

function example_sessionStorage_formatter() {
  /**
   * Custom object with sessionstorage
   * format json to str and str to json
   */
  console.group('Example: session storage, formatters ( to string, to object )');
  interface CustomObject {
    name: string;
    id: number;
  }

  const storeSessionStorage = new JStore<CustomObject>({
    // custom storage
    storage: new LocalStorage<CustomObject>(),
    inputFormatters: [
      new JSONToStringFormatter()
    ],
    outputFormatters: [
      new StringToJSONFormatter()
    ]
  });

  const subscriptionLocalStorage = storeSessionStorage.subscribe((value: CustomObject) => {
    console.log('storeSessionStorage', value);
  });

  storeSessionStorage.dispatch({
    name: 'name',
    id: 2
  });
  storeSessionStorage.dispatch({
    name: 'name1',
    id: 2
  });

  storeSessionStorage.destroy(subscriptionLocalStorage);
  console.groupEnd();
}

function example_strictStore() {
  /**
   * strict store
   */
  console.group('Example: strict storage');
  const storeNumberStrict = new JStore<any>({
    strictTypeCheck: true,
    initValue: '13'
  });

// ok, string type
  storeNumberStrict.dispatch('Hello, World!');

// error if initValue type string
  try {
    storeNumberStrict.dispatch(1123);
  } catch (e) {
    console.log(e);
  }

  console.groupEnd();
}

function example_forkJoin() {
  console.group('forkJoin');

  const storeNumber = storeFactory<number>();
  const storeString = storeFactory<string>();

  forkJoin([
    storeNumber.observable(),
    storeString.observable()
  ]).subscribe(v => {
    console.log('forkJoin result', v);
  });

  storeNumber.dispatch(100);
  storeString.dispatch('hellooooooo');

  storeNumber.destroy();
  storeString.destroy();

  console.groupEnd();
}

function example_selector() {
  console.group('Example: selector');
  interface Obj {
    name: string;
    id: number;
    extra: {
      min: number;
      max: number;
    };
  }

  const store = new JStore<Obj>();

  const subscriptionLocalStorage = store.subscribe((value: Obj) => {
    console.log('store', value);
  });

  store.dispatch({
    name: 'name',
    id: 2,
    extra: {
      min: 1,
      max: 10
    }
  });
  store.dispatch({
    name: 'name',
    id: 2,
    extra: {
      min: 50,
      max: 100
    }
  });

  // selector, maybe reuse in other stores
  function minValueSelector(value: Obj): number {
    return value.extra.min;
  }

  store.select<number>(minValueSelector).subscribe(value => {
    console.log('selector min value', value);
  });

  store.destroy(subscriptionLocalStorage);
  console.groupEnd();
}


console.group('JStore');


example_storeFactory_context_number();

example_forkJoin();

example_initValue_formatters();

example_sessionStorage_formatter();

example_strictStore();

example_selector();


console.groupEnd();

testDispatcher();