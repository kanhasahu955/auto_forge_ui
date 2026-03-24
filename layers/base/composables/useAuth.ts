/**
 * Auth composable - login, register, logout, user state
 * Uses auth-token cookie. AutoForge (shell) has login/register pages.
 */
export type AuthUser = {
  id: string
  name: string
  email: string
  role?: string
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
  const tokenCookie = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
  })

  const user = computed<AuthUser | null>(() => {
    const token = tokenCookie.value
    if (!token || typeof token !== 'string') return null

    const id = hashToken(token)
    const payload = decodeJwtPayload(token)
    const name = (payload?.name as string) ?? (payload?.username as string) ?? (payload?.email as string) ?? 'User'
    const email = (payload?.email as string) ?? ''
    const role = (payload?.role as string) ?? (payload?.role_id as string)

    return { id, name, email, role }
  })

  const isLoggedIn = computed(() => !!tokenCookie.value && !!user.value)

  const setToken = (token: string | null) => {
    tokenCookie.value = token
  }

  const logout = () => {
    tokenCookie.value = null
  }

  return {
    user,
    isLoggedIn,
    tokenCookie,
    setToken,
    logout,
  }
}
