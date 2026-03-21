/**
 * Shared routing utilities for microfrontend navigation
 * Respects baseURL for app-relative routes
 */

export type RouteLocation = string | { path: string; query?: Record<string, string> }

/**
 * Build full path respecting microfrontend baseURL
 * e.g. baseURL='/interview-agent/', path='/dashboard' -> '/interview-agent/dashboard'
 */
export function resolveRoute(baseURL: string, path: string): string {
  const base = baseURL.replace(/\/$/, '')
  const routePath = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${routePath}` : routePath
}

/**
 * Route names for cross-app navigation (optional)
 */
export const ROUTES = {
  HOME: '/',
  INTERVIEW_AGENT: '/interview-agent/',
  INTERVIEW_AGENT_DASHBOARD: '/interview-agent/dashboard',
  AUTOFORGE: '/',
} as const
