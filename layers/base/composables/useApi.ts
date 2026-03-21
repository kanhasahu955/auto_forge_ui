/**
 * Reusable API composable - axios client + request helpers with runtime config
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

export function useApi() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || config.apiBase || ''
  const tokenCookie = useCookie<string | null>('auth-token')

  const client = createApiClient(apiBase, {
    getAuthToken: () => tokenCookie.value,
  })

  const api = createApiRequests(client)

  return {
    client,
    api,
    ...api,
  }
}
