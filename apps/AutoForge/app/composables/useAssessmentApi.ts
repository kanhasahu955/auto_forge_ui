/**
 * Assessment API - list/create assessments (standalone, not org-scoped)
 * Calls backend via gateway at /api/v1/assessments
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const ASSESSMENT_PREFIX = '/api/v1/assessments'

export interface Assessment {
  id: string
  title?: string
  duration_minutes?: number
  status?: string
  created_at?: string
}

export function useAssessmentApi() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:8000'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(apiBase, { getAuthToken: () => tokenCookie.value })
  const { get, post } = createApiRequests(client)

  const health = () => get<{ status: string; service: string }>(`${ASSESSMENT_PREFIX}/health`)

  const listAssessments = (params?: { limit?: number; offset?: number }) =>
    get<{ items: Assessment[]; total: number }>(`${ASSESSMENT_PREFIX}/assessments`, { params })

  const createAssessment = (body: { title: string; duration_minutes: number }) =>
    post<{ message?: string } & Assessment>(`${ASSESSMENT_PREFIX}/assessments`, body)

  return {
    health,
    listAssessments,
    createAssessment,
  }
}
