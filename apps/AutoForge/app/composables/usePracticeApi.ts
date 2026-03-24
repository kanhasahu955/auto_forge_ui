/**
 * Practice API - tracks, streaks
 * Calls backend via gateway at /api/v1/practice
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const PRACTICE_PREFIX = '/api/v1/practice'

export interface Track {
  id: string
  name?: string
  slug?: string
  description?: string
  question_count?: number
}

export interface Streak {
  current_streak: number
  longest_streak: number
}

export function usePracticeApi() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:8000'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(apiBase, { getAuthToken: () => tokenCookie.value })
  const { get } = createApiRequests(client)

  const health = () => get<{ status: string; service: string }>(`${PRACTICE_PREFIX}/health`)

  const listTracks = () =>
    get<{ items: Track[]; total: number }>(`${PRACTICE_PREFIX}/tracks`)

  const getMyStreak = () =>
    get<Streak>(`${PRACTICE_PREFIX}/me/streak`)

  return {
    health,
    listTracks,
    getMyStreak,
  }
}
