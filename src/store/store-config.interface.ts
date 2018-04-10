import { StorageInterface } from './storage/storage.interface';
import { FormatterInterface } from './formatter/formatter.interface';

export interface StoreConfigInterface<T> {
  initValue?: T;
  storage?: StorageInterface<T>;

  inputFormatters?: FormatterInterface[];
  outputFormatters?: FormatterInterface[];

  strictTypeCheck?: boolean;
}