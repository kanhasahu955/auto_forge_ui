/**
 * Shared GraphQL client - use via useGraphql() composable
 */
import { GraphQLClient, type RequestDocument, type Variables } from 'graphql-request'

export function createGraphQLClient(endpoint: string, headers?: Record<string, string>): GraphQLClient {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export type { GraphQLClient, RequestDocument, Variables }
export { gql } from 'graphql-request'
