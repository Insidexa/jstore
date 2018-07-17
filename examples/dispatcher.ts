import { of, Observable } from 'rxjs';

import {
  ToNumberFormatter,
  ToStringFormatter,
  JStore,
  JStoreDispatcher,
  Middleware,
  MiddlewareData
} from '../src/index';

import { LocalStorage } from './stores/localstorage.store';

export const testDispatcher = () => {
  console.group('JStoreDispatcher');

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


  /**
   * store dispatcher
   */
  const dispatcher = new JStoreDispatcher(storeNumber);

  class AddMiddleware implements Middleware {
    next<T>(data: MiddlewareData<T>): Observable<number> {
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


  dispatcher.action(actionInc);

  // destroy listener
  listener();

  dispatcher.action(actionInc); // 3

  // snapshot with history & store, date, name
  const snapshot1 = dispatcher.makeSnapshot('three');

  dispatcher.action(actionDec);

  console.log('restore....');
  // restore snapshot with history, value
  dispatcher.restoreSnapshot(snapshot1);

  dispatcher.action(actionDec);


  console.info('new store');
  const storeNumber1 = new JStore<number>();
  storeNumber1.subscribe((value: number) => {
    console.log('storeNumber1', value);
  });

  const dispatcher1 = new JStoreDispatcher(storeNumber1);

  console.info('restore from snapshot1');
  // restoring from another store
  dispatcher1.restoreSnapshot(snapshot1);

  // lock dispatcher, another actions disable, throw error
  console.log('lock dispatcher1');
  dispatcher1.lock();

  try {
    // error
    dispatcher1.action(actionInc);
  } catch (e) {
    console.log(e);
  }

  // unlock, try to unlock two or more - error
  dispatcher1.unlock();
  dispatcher1.action(actionInc);

  dispatcher.destroy(subscriptionNumber);

  console.groupEnd();
};