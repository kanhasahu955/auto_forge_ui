/**
 * Re-export lodash-es for tree-shaking
 * In Nuxt apps, prefer nuxt-lodash (_) from base layer for auto-import
 */
export {
  clone,
  cloneDeep,
  debounce,
  get,
  set,
  merge,
  pick,
  omit,
  throttle,
  uniq,
  uniqBy,
  sortBy,
  groupBy,
  keyBy,
  mapKeys,
  mapValues,
  isEmpty,
  isEqual,
  camelCase,
  snakeCase,
  kebabCase,
  capitalize,
} from 'lodash-es'

export type { DebouncedFunc } from 'lodash-es'
