/**
 * Reporting API - leaderboard, assessment reports
 * Calls backend via gateway at /api/v1/reports
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const REPORT_PREFIX = '/api/v1/reports'

export interface LeaderboardEntry {
  rank?: number
  user_id?: string
  username?: string
  score?: number
  total_solved?: number
}

export interface AssessmentReport {
  assessment_id: string
  summary?: Record<string, unknown>
}

export function useReportingApi() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:8000'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(apiBase, { getAuthToken: () => tokenCookie.value })
  const { get } = createApiRequests(client)

  const health = () => get<{ status: string; service: string }>(`${REPORT_PREFIX}/health`)

  const getLeaderboard = (params?: { limit?: number; offset?: number }) =>
    get<{ entries: LeaderboardEntry[]; total: number }>(`${REPORT_PREFIX}/leaderboard`, { params })

  const getAssessmentReport = (assessmentId: string) =>
    get<AssessmentReport>(`${REPORT_PREFIX}/reports/${assessmentId}`)

  return {
    health,
    getLeaderboard,
    getAssessmentReport,
  }
}
