/**
 * Contest API - contests, leaderboard
 * Calls backend via gateway at /api/v1/contests
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const CONTEST_PREFIX = '/api/v1/contests'

export interface Contest {
  id: string
  title?: string
  slug?: string
  start_time?: string
  end_time?: string
  status?: string
}

export interface LeaderboardEntry {
  rank?: number
  user_id?: string
  username?: string
  score?: number
  submitted_at?: string
}

export function useContestApi() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:8000'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(apiBase, { getAuthToken: () => tokenCookie.value })
  const { get } = createApiRequests(client)

  const health = () => get<{ status: string; service: string }>(`${CONTEST_PREFIX}/health`)

  const listContests = () =>
    get<{ items: Contest[]; total: number }>(CONTEST_PREFIX)

  const getLeaderboard = (contestId: string) =>
    get<{ contest_id: string; entries: LeaderboardEntry[] }>(`${CONTEST_PREFIX}/${contestId}/leaderboard`)

  return {
    health,
    listContests,
    getLeaderboard,
  }
}
