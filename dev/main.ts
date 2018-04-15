import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  JStore,
  storeFactory,
  TrimFormatter,
  StringToJSONFormatter,
  JSONToStringFormatter
} from '../src/index';

import { LocalStorage } from './localstorage.store';
import { testDispatcher } from './dispatcher';

/**
 * store factory
 */
const st = storeFactory<number>();
const scSt = st.subscribe((n: number) => {
  console.log('n', n);
});
st.changeContext((fn) => {
  function $scopeApply(fn: Function) {
    console.log(`example, run in 'angular context'`);
    fn();
  }

  $scopeApply(fn);
});
st.dispatch(100000000);


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


forkJoin([st.observable(), storeString.observable()]).subscribe(v => {
  console.log('forkJoin', v);
});

st.dispatch(11);
storeString.dispatch('    asdasd asd asd ');

// complete store & unsubscribe onChange
st.destroy(scSt);
storeString.destroy(subscriptionString);


/**
 * Custom object with localstorage
 * format json to str and str to json
 */

interface CustomObject {
  name: string;
  id: number;
}

const storeLocalStorage = new JStore<CustomObject>({
  // custom storage
  storage: new LocalStorage<CustomObject>(),
  inputFormatters: [
    new JSONToStringFormatter()
  ],
  outputFormatters: [
    new StringToJSONFormatter()
  ]
});

const subscriptionLocalStorage = storeLocalStorage.subscribe((value: CustomObject) => {
  console.log('storeLocalStorage', value);
});

storeLocalStorage.dispatch({
  name: 'name',
  id: 2
});
storeLocalStorage.dispatch({
  name: 'name1',
  id: 2
});

storeLocalStorage.destroy(subscriptionLocalStorage);


/**
 * strict store
 */
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


console.log('\n\n======================================');
console.info(' TEST Dispatcher');

testDispatcher();