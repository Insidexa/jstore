import { FilterInterface } from './filter.interface';

export class EvenCollectionFilter<T> implements FilterInterface<T> {
  by(value: T): T {
    if (!Array.isArray(value)) {
      throw new Error(`value genertic of 'T' (${value}) is not array`);
    }
    return (value as any).filter((val: number) => val % 2);
  }
}