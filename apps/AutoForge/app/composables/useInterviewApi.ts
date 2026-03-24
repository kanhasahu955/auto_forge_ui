/**
 * Interview API - rooms, WebSocket join
 * Calls backend via gateway at /api/v1/interviews
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const INTERVIEW_PREFIX = '/api/v1/interviews'

export interface InterviewRoom {
  room_id: string
  ws_url: string
}

export function useInterviewApi() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:8000'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(apiBase, { getAuthToken: () => tokenCookie.value })
  const { get, post } = createApiRequests(client)

  const health = () => get<{ status: string; service: string }>(`${INTERVIEW_PREFIX}/health`)

  const createRoom = () =>
    post<InterviewRoom>(`${INTERVIEW_PREFIX}/rooms`, {})

  const getWsUrl = (roomId: string) => {
    const config = useRuntimeConfig()
    const base = (config.public.apiBase as string) || ''
    const wsBase = base.replace(/^http/, 'ws')
    return `${wsBase}${INTERVIEW_PREFIX}/ws/${roomId}`
  }

  return {
    health,
    createRoom,
    getWsUrl,
  }
}
