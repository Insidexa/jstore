import { Action, ActionFn, MakeAction } from './action';

export const makeAction: MakeAction = <T>(name: string, fn: ActionFn<T>): Action<T> => {
  return {
    name,
    fn
  };
};