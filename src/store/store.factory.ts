import { JStore } from './jstore';
import { StoreConfigInterface } from './store-config.interface';
import { JStoreConfResolver } from './config-resolver';

export function storeFactory<T>(config: StoreConfigInterface<T> = null): JStore<T> {
  if (!config) {
    return new JStore<T>();
  }

  const resolvedConfig = JStoreConfResolver(config);

  return new JStore<T>(resolvedConfig);
}