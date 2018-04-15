import { JStore } from './jstore';
import { StoreConfigInterface } from './store-config.interface';
export declare function storeFactory<T>(config?: StoreConfigInterface<T>): JStore<T>;
