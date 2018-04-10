import { StoreConfigInterface } from './store-config.interface';
import { SimpleStorage } from './storage/simple.storage';
import { FormatterInterface } from './formatter/formatter.interface';
import { StorageInterface } from './storage/storage.interface';

const INIT_VALUE = 'initValue';
const IN_FMS = 'inputFormatters';
const OUT_FMS = 'outputFormatters';
const STORAGE = 'storage';
const STRICT = 'strictTypeCheck';

export function JStoreConfResolver<T> (config: StoreConfigInterface<T>): StoreConfigInterface<T> {
  let initValue: any;
  let inputFormatters: FormatterInterface[] = [];
  let outputFormatters: FormatterInterface[] = [];
  let strictTypeCheck: boolean = false;
  let storage: StorageInterface<T> = new SimpleStorage<T>();

  if (config.hasOwnProperty(INIT_VALUE)) {
    initValue = config[INIT_VALUE];
  }

  if (config.hasOwnProperty(IN_FMS)) {
    inputFormatters = config[IN_FMS];
  }

  if (config.hasOwnProperty(OUT_FMS)) {
    outputFormatters = config[OUT_FMS];
  }

  if (config.hasOwnProperty(STORAGE)) {
    storage = config[STORAGE];
  }

  if (config.hasOwnProperty(STRICT)) {
    strictTypeCheck = config[STRICT];
  }

  return {
    initValue,
    inputFormatters,
    outputFormatters,
    strictTypeCheck,
    storage
  };
}