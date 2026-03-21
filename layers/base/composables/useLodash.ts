/**
 * Reusable lodash composable - use as: const _ = useLodash(); _.debounce(fn, 300)
 */
import * as lodash from '@nuxt-mfe/shared/lodash'

export function useLodash() {
  return lodash
}
