import { JStore } from './store/jstore';
import { LocalStorage } from './store/storage/localstorage.store';
import { storeFactory } from './store/store.factory';
import { TrimFormatter } from './store/formatter/trim.formatter';
import { StringToJSONFormatter } from './store/formatter/string-to-json.formatter';
import { JSONToStringFormatter } from './store/formatter/json-to-string.formatter';
import { testDispatcher } from './dispatcher';


/**
 * store factory
 */
const st = storeFactory<number>();
const scSt = st.value().subscribe((n: number) => {
  console.log('n', n);
});
st.dispatch(100000000);
// complete store & unsubscribe onChange
st.destroy(scSt);


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

const subscriptionString = storeString.value().subscribe((value: string) => {
  console.log('storeString', value);
});

storeString.dispatch('a    ');
storeString.dispatch('     b');
storeString.dispatch('ac c');
storeString.dispatch('asd');
storeString.dispatch('    asdasd asd asd ');

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

const subscriptionLocalStorage = storeLocalStorage.value().subscribe((value: CustomObject) => {
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
storeNumberStrict.dispatch(1123);

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