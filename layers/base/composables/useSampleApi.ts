/**
 * Sample API composable - uses JSONPlaceholder for dev/demo
 * Falls back to main apiBase when NUXT_PUBLIC_SAMPLE_API is not set
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'
import { SAMPLE_API_BASE, SAMPLE_ENDPOINTS } from '@nuxt-mfe/shared/sample-api'
import type { Post, User } from '@nuxt-mfe/shared/sample-api'

export { SAMPLE_ENDPOINTS }

export function useSampleApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.sampleApiBase || SAMPLE_API_BASE

  const client = createApiClient(baseURL)
  const api = createApiRequests(client)

  return {
    client,
    api,
    async getPosts() {
      return api.get<Post[]>(SAMPLE_ENDPOINTS.posts)
    },
    async getPost(id: number) {
      return api.get<Post>(SAMPLE_ENDPOINTS.post(id))
    },
    async getUsers() {
      return api.get<User[]>(SAMPLE_ENDPOINTS.users)
    },
    async getUser(id: number) {
      return api.get<User>(SAMPLE_ENDPOINTS.user(id))
    },
    async createPost(data: Omit<Post, 'id'>) {
      return api.post<Post>(SAMPLE_ENDPOINTS.posts, data)
    },
  }
}
