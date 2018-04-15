import {
  ToNumberFormatter,
  ToStringFormatter,
  JStore,
  JStoreDispatcher
} from '../src/index';

import { LocalStorage } from './localstorage.store';

export const testDispatcher = () => {
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
  storeNumber.destroy(subscriptionNumber);

  // not work
  storeNumber.dispatch(2);


  /**
   * store dispatcher
   */
  const dispatcher = new JStoreDispatcher(storeNumber);

// named action with state, saved in history
// action as function
  const actionInc = JStoreDispatcher.makeAction<number>('inc', (value: number) => value + 1);
  const actionDec = JStoreDispatcher.makeAction<number>('dec', (value: number) => value - 1);

// listener on action by action function
  dispatcher.on(actionInc, (value: number, destroyFn: () => void) => {
    console.log('on action {actionInc}: ', actionInc, value);
    // destroy listener
    destroyFn();
  });

// listener by name
  dispatcher.on(actionDec, (value: number, destroyFn: () => void) => {
    console.log('on action {dec}: ', actionDec, value);
    destroyFn();
  });

// snapshot with history & store, date, name
  const snapshot1 = dispatcher.makeSnapshot('three');

// restore snapshot with history, value
  dispatcher.restoreSnapshot(snapshot1);

  dispatcher.action(actionInc);

  dispatcher.action(actionDec);


  console.info('\nnew store');
  const storeNumber1 = new JStore<number>();
  storeNumber1.subscribe((value: number) => {
    console.log('storeNumber1', value);
  });

  const d1 = new JStoreDispatcher(storeNumber1);
  console.info('restore from snapshot1');

// restoring from another store
  d1.restoreSnapshot(snapshot1);

// lock dispatcher, another actions disable, throw error
  console.log('lock d1');
  d1.lock();

  try {
    // error
    d1.action(actionInc);
  } catch (e) {
    console.log(e);
  }

// unlock, try to unlock two or more - error
  d1.unlock();
  d1.action(actionInc);
};