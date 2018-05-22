import { ICache } from './i-cache';
import { MemoryCache } from './memory-cache';
import { AlwaysMissCache } from './always-miss-cache';

export { ICache };

export function createDefaultCache<T>() : ICache<T> {
  if(process.env.NOCACHE)
    return new AlwaysMissCache();
  else
    return new MemoryCache();
}


