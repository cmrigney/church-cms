import { ICache } from './i-cache';
import { Map } from "../../../helpers/types";

export class MemoryCache<T> implements ICache<T> {
  private _memory: Map<T>;
  constructor() {
    this._memory = {};
  }

  get(key: string): Promise<T> {
    return Promise.resolve(this._memory[key]);
  }
  set(key: string, value: T): Promise<void> {
    this._memory[key] = value;
    return Promise.resolve();
  }
  delete(key: string): Promise<void> {
    if(typeof this._memory[key] !== 'undefined')
      delete this._memory[key];
    return Promise.resolve();
  }
}
