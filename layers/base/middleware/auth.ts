/**
 * Auth middleware - redirect to /auth/login when accessing protected routes
 * Shared across org-mfe, AutoForge, etc.
 */
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.auth === false) return
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value && to.path.startsWith('/organizations')) {
    return navigateTo('/login')
  }
})
