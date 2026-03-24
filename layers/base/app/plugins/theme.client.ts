/**
 * Initialize theme on app load - ensures html gets dark class before hydration.
 * Runs before any component mounts so dark/light mode is applied immediately.
 */
import { useTheme } from '../../composables/useTheme'

export default defineNuxtPlugin(() => {
  useTheme()
})
