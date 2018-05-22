import { createDefaultCache, ICache } from './impl';
import { PageResult } from '../../helpers/types';

let pageCache = createDefaultCache<PageResult>();

export function getPageCache() {
  return pageCache;
}

export function invalidatePageCache() {
  pageCache = createDefaultCache<PageResult>();
}

