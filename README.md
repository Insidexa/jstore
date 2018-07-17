### JStore - simple, flexible, reactive store

#### Install
`yarn add @jashkasoft/rx-jstore`

#### JStore
 - initValue only condition check `if` operator
 - clone with last value only if jstore has config property initial value
 - formatters run with priority by index ( prev value passed to next formatter )
   return last formatted value
 - middleware
   
 - Base:
     formatters:
         - to number
         - to string
         - trim
     storage:
         - simple storage ( in memory )
     
##### Examples
- Initial value
    ```typescript
    import { JStore } from '@jashkasoft/rx-jstore';
 
    const store = new JStore<string>({
         initValue: 'string',
    });

    const subscription = store.subscribe((value: string) => {
        console.log('store', value); // string and after new str
    });

    store.dispatch('new str');

    // complete store & unsubscribe
    store.destroy(subscription);
    ```
 - Custom input & output formatters ( Formatters are Observable )
     
    ```typescript
    import { JStore, TrimFormatter, FormatterInterface } from '@jashkasoft/rx-jstore';   
    import { of, Observable } from 'rxjs';

    class TrimFormatter implements FormatterInterface {
       public transform(str: string): Observable<string> {
         return of(str.trim());
       }
     }
    class StrEndOutputFormatter implements FormatterInterface {
       public transform(str: string): Observable<string> {
         return of(str + ' end of string');
       }
     }
    const store = new JStore<string>({
         inputFormatters: [
            new TrimFormatter()
         ],
         outputFormatters: [
            new StrEndOutputFormatter()
         ]
    });
    const subscription = store.subscribe((value: string) => {
        console.log('store', `'${value}'`); // 'new str end of string'
    });
    store.dispatch('      new str   ');
    store.destroy(subscription);
    ```
 - Custom storage
    ```typescript
    import { JStore, StorageInterface, FormatterInterface } from '@jashkasoft/rx-jstore';   
    import { of, Observable } from 'rxjs';
    import { map } from 'rxjs/operators';
    
    interface CustomObject {
       name: string;
       id: number;
     }
    
    class LocalStorage<T> implements StorageInterface<T> {
      constructor(private token: string = 'store') {
      }
    
      public get(): Observable<any> {
        return of(localStorage.getItem(this.token));
      }
    
      public set(value: any): Observable<T | null> {
        localStorage.setItem(this.token, value);
        return of(value);
      }
    
      public clear(): Observable<T | null> {
        localStorage.removeItem(this.token);
        return of(null);
      }
    
    }
    
    class StringToJSONFormatter implements FormatterInterface {
      public transform(str: string): Observable<any> {
        return of(JSON.parse(str));
      }
    }
 
    class JSONToStringFormatter implements FormatterInterface {
      public transform(json: any): Observable<string> {
        return of(json)
          .pipe(
            map(json => JSON.stringify(json))
          );
      }
    }
     
    const store = new JStore<CustomObject>({
      storage: new LocalStorage<CustomObject>(),
      inputFormatters: [
        new JSONToStringFormatter()
      ],
      outputFormatters: [
        new StringToJSONFormatter()
      ]
    });
     
    const subscription = store.subscribe((value: CustomObject) => {
      console.log('store', value);
    });
    
    store.dispatch({
      name: 'name',
      id: 2
    });
    
    store.destroy(subscription);
    ```
 - Strict storage checking
    ```typescript
    const store = new JStore<any>({
        strictTypeCheck: true,
        initValue: '13'
    });
    
    // ok, string type
    store.dispatch('Hello, World!');
    
    // error if initValue type string
    try {
      store.dispatch(1123);
    } catch (e) {
      console.log(e);
    }
    ```
 - context run
    ```typescript
    import { storeFactory, RunContext } from '@jashkasoft/rx-jstore';   

    const store = storeFactory<number>();
    const sub = store.subscribe((n: number) => {
      console.log('number', n);
    });
 
    function youContext(fn: Function) {
     fn();
    }
 
    store.changeContext((fn: RunContext) => youContext(fn));
    store.dispatch(100000000);
    store.destroy(sub);
    ```
 - selector
    ```typescript
    import { JStore } from '@jashkasoft/rx-jstore';   
 
    interface Obj {
        name: string;
        id: number;
        extra: {
          min: number;
          max: number;
        };
    }
    
    const store = new JStore<Obj>();
  
    const subscription = store.subscribe((value: Obj) => {
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
  
    store.destroy(subscription);
    ```

##

#### JStoreDispatcher over JStore
```typescript
import { of, Observable } from 'rxjs';

import {
  ToNumberFormatter,
  ToStringFormatter,
  JStore,
  JStoreDispatcher,
  Middleware,
  MiddlewareData
} from '@jashkasoft@rx-jstore';

const storeNumber = new JStore<number>({
  storage: new LocalStorage<number>('number'),
  inputFormatters: [
    new ToStringFormatter()
  ],
  outputFormatters: [
    new ToNumberFormatter()
  ]
});
const subscriptionNumber = storeNumber.subscribe((value: number) => {
  console.log('storeNumber', value);
});


storeNumber.dispatch(1);


// destroy subscription (subscriptionNumber) and observable call complete
// storeNumber.destroy(subscriptionNumber);
// throw error if completed
/*try {
  storeNumber.dispatch(2);
} catch (e) {
  console.log(e);
}*/
```
 - Actions
    ```typescript
    const dispatcher = new JStoreDispatcher(storeNumber);
    const actionInc = JStoreDispatcher.makeAction<number>(
      'inc',
      (value: number) => {
        return of(value + 1);
      }
    );
    const actionDec = JStoreDispatcher.makeAction<number>('dec', (value: number) => value - 1);
    
    // listener on action by action function
    const listener = dispatcher.on(actionInc, (value: number) => {
      console.log('on action {actionInc}: ', value);
    });
    
    dispatcher.action(actionInc);
    
    // destroy listener
    listener();
    
    dispatcher.action(actionInc); // 3
 
    dispatcher.destroy(subscriptionNumber);
    ```
 - Lock & unlock
    ```typescript
    // lock dispatcher, another actions disable, throw error
    console.log('lock dispatcher1');
    dispatcher.lock();
    try {
      // error
      dispatcher.action(actionInc);
    } catch (e) {
      console.log(e);
    }
    // unlock, try to unlock two or more - error
    dispatcher.unlock();
    
    dispatcher.action(actionInc);
    ```
 - Snapshots
    ```typescript
    // snapshot with history & store, date, name
    const snapshot1 = dispatcher.makeSnapshot('three');
    
    dispatcher.action(actionDec);
    
    console.log('restore....');
    // restore snapshot with history, value
    dispatcher.restoreSnapshot(snapshot1);
    
    dispatcher.action(actionDec);
    ```
 - Middleware
    ```typescript
    const dispatcher = new JStoreDispatcher(storeNumber);
    class AddMiddleware implements Middleware {
      public next<T>(data: MiddlewareData<T>): Observable<number> {
        const n = Math.floor(Math.random() * 10); // or http request
        console.log('data middleware', data, 'random number', n);
        /*if (n % 2 === 0) {
          throw new Error('n % 2 === 0');
        }*/
        return of(n);
      }
    }
    // named action with state, saved in history
    // action as function
    const actionInc = JStoreDispatcher.makeAction<number>(
      'inc',
      (value: number, data: any) => {
        console.log(value, data);
        return of(value + data);
      },
      new AddMiddleware()
    );
    const actionDec = JStoreDispatcher.makeAction<number>('dec', (value: number) => value - 1);
    
    // listener on action by action function
    const listener = dispatcher.on(actionInc, (value: number) => {
      console.log('on action {actionInc}: ', value);
    });
 
    // destroy listener
    listener();
    ```




### For development
###### Переходим в директорию с проектом
```bash
cd folder-name
```

###### Установка зависимостей
```bash
yarn
```

###### Запуск сборки приложения и веб-сервера:
```bash
yarn run serve
```

###### Сборка приложения с минификацией: 
```bash
yarn run build
```
