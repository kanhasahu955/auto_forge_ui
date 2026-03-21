/**
 * Reusable routing composable - respects baseURL for microfrontends
 */
import { resolveRoute, ROUTES } from '@nuxt-mfe/shared/routing'

export function useNavigation() {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()
  const baseURL = config.app?.baseURL || '/'

  const go = (path: string, options?: { openInNewTab?: boolean }) => {
    const fullPath = resolveRoute(baseURL, path)
    if (options?.openInNewTab && import.meta.client) {
      window.open(fullPath, '_blank')
    } else {
      return navigateTo(fullPath)
    }
  }

  return {
    route,
    router,
    baseURL,
    go,
    ROUTES,
    resolvePath: (path: string) => resolveRoute(baseURL, path),
  }
}
