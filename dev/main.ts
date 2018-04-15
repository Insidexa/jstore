import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  JStore,
  storeFactory,
  TrimFormatter,
  StringToJSONFormatter,
  JSONToStringFormatter
} from '../src/index';

import { LocalStorage } from './stores/localstorage.store';
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
  store.changeContext((fn) => {
    function $scopeApply(fn: Function) {
      console.log(`example, run in 'angular context'`);
      fn();
    }

    $scopeApply(fn);
  });
  store.dispatch(100000000);
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

// check after store initial
// error, prev type not equals to current
  try {
    storeNumberStrict.dispatch('');
  } catch (e) {
    console.error(e);
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

console.group('JStore');


example_storeFactory_context_number();

example_forkJoin();

example_initValue_formatters();

example_sessionStorage_formatter();

example_strictStore();


console.groupEnd();

testDispatcher();