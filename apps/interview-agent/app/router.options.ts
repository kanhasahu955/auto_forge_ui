import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' as const }
    return { top: 0, behavior: 'smooth' as const }
  },
} satisfies RouterConfig
