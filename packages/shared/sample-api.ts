/**
 * Sample API endpoints - JSONPlaceholder (https://jsonplaceholder.typicode.com)
 * Use for development/demo. Override baseURL in .env for production.
 */
export const SAMPLE_API_BASE = 'https://jsonplaceholder.typicode.com'

export const SAMPLE_ENDPOINTS = {
  posts: '/posts',
  post: (id: number) => `/posts/${id}`,
  comments: '/comments',
  comment: (id: number) => `/comments/${id}`,
  users: '/users',
  user: (id: number) => `/users/${id}`,
  todos: '/todos',
  todo: (id: number) => `/todos/${id}`,
} as const

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: { lat: string; lng: string }
  }
  phone?: string
  website?: string
  company?: { name: string; catchPhrase: string; bs: string }
}
