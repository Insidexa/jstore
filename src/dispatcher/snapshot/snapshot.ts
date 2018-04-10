import { JStore } from '../../store/jstore';
import { ActionInterface } from '../action/action.interface';

export class Snapshot<T> {

  constructor(private readonly name: string,
              private readonly store: JStore<T>,
              private readonly actions: ActionInterface<T>[],
              private readonly date: Date) {
  }

  public getName(): string {
    return this.name;
  }

  public getStore(): JStore<T> {
    return this.store;
  }

  public getActions(): ActionInterface<T>[] {
    return this.actions;
  }

  public getDate(): Date {
    return this.date;
  }
}