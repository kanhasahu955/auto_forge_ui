// Shared utilities and types across microfrontends
export const MF_APPS = ['AutoForge', 'interview-agent'] as const
export type MFApp = (typeof MF_APPS)[number]

// Re-exports for convenience
export { createApiClient, createApiRequests } from './api'
export { SAMPLE_API_BASE, SAMPLE_ENDPOINTS } from './sample-api'
export type { Post, User } from './sample-api'
export { createGraphQLClient, gql } from './graphql'
export { resolveRoute, ROUTES } from './routing'
export * from './lodash'
