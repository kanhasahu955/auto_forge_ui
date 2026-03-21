/**
 * Auth from parent app - reads auth-token cookie set by main app
 * User credentials come from parent; no login page in interview-agent
 */

export type AuthUser = {
  id: string
  name: string
  email: string
}

function hashToken(token: string): string {
  let h = 0
  for (let i = 0; i < token.length; i++) {
    const c = token.charCodeAt(i)
    h = ((h << 5) - h) + c
    h = h & h
  }
  return `user_${Math.abs(h).toString(36)}`
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload) as Record<string, unknown>
  } catch {
    return null
  }
}

export function useAuth() {
  const tokenCookie = useCookie<string | null>('auth-token')

  const user = computed<AuthUser | null>(() => {
    const token = tokenCookie.value
    if (!token || typeof token !== 'string') return null

    const id = hashToken(token)
    const payload = decodeJwtPayload(token)
    const name = (payload?.name as string) ?? (payload?.username as string) ?? (payload?.email as string) ?? 'User'
    const email = (payload?.email as string) ?? ''

    return { id, name, email }
  })

  const isLoggedIn = computed(() => !!user.value)

  return {
    user,
    isLoggedIn,
  }
}
