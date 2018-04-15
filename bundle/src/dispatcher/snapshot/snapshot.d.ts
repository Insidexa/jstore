import { JStore } from '../../store/jstore';
import { ActionInterface } from '../action/action.interface';
export declare class Snapshot<T> {
    private readonly name;
    private readonly store;
    private readonly actions;
    private readonly date;
    constructor(name: string, store: JStore<T>, actions: ActionInterface<T>[], date: Date);
    getName(): string;
    getStore(): JStore<T>;
    getActions(): ActionInterface<T>[];
    getDate(): Date;
}
