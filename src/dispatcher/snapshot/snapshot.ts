import { JStore } from '../../store/jstore';
import { ActionData } from '../action/action';

export class Snapshot<T> {

  constructor(private readonly name: string,
              private readonly store: JStore<T>,
              private readonly actions: ActionData<T>[],
              private readonly date: Date) {
  }

  public getName(): string {
    return this.name;
  }

  public getStore(): JStore<T> {
    return this.store;
  }

  public getActions(): ActionData<T>[] {
    return this.actions;
  }

  public getDate(): Date {
    return this.date;
  }
}