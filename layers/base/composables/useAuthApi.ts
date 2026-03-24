/**
 * Auth API - login, register, me, refresh, logout
 * Shared across auth-mfe, AutoForge, etc.
 * Calls auth service directly (not via gateway)
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'
import { useAuth } from './useAuth'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

interface UserResponse {
  id: string
  email: string
  name: string
  tenant_id: string | null
  role: string
  is_active: boolean
}

const AUTH_PREFIX = '/api/v1/auth'

export function useAuthApi() {
  const config = useRuntimeConfig()
  const authBase = (config.public.authApiBase as string) || 'http://localhost:8001'
  const tokenCookie = useCookie<string | null>('auth-token')
  const { setToken, logout: clearAuth } = useAuth()

  const client = createApiClient(authBase, {
    getAuthToken: () => tokenCookie.value,
  })
  const { post, get } = createApiRequests(client)

  const login = async (req: LoginRequest) => {
    const res = await post<TokenResponse>(`${AUTH_PREFIX}/login`, req)
    if (res?.access_token) {
      setToken(res.access_token)
      return res
    }
    throw new Error('Login failed')
  }

  const register = async (req: RegisterRequest) => {
    const user = await post<UserResponse>(`${AUTH_PREFIX}/register`, {
      ...req,
      role: req.role || 'student',
    })
    if (user?.email) {
      return user
    }
    throw new Error('Registration failed')
  }

  const fetchMe = async () => {
    const res = await get<UserResponse>(`${AUTH_PREFIX}/me`)
    return res
  }

  const doLogout = async () => {
    try {
      await post(`${AUTH_PREFIX}/logout`)
    } finally {
      clearAuth()
    }
  }

  return {
    login,
    register,
    fetchMe,
    logout: doLogout,
  }
}
