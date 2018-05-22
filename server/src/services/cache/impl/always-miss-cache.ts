import { ICache } from './i-cache';

//Mainly for testing purposes
export class AlwaysMissCache<T> implements ICache<T> {
  get(key: string): Promise<T> {
    return Promise.resolve(undefined);
  }
  set(key: string, value: T): Promise<void> {
    return Promise.resolve();
  }
  delete(key: string): Promise<void> {
    return Promise.resolve();
  }
}
