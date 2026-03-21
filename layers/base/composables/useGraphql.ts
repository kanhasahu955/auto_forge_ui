/**
 * Reusable GraphQL composable - client with runtime config
 */
import { createGraphQLClient } from '@nuxt-mfe/shared/graphql'

export function useGraphql() {
  const config = useRuntimeConfig()
  const endpoint = config.public.graphqlEndpoint || config.graphqlEndpoint || ''
  return createGraphQLClient(endpoint)
}
