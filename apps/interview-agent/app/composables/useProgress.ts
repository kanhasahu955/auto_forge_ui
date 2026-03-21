/**
 * Progress tracking - solved problems, stats (localStorage for mock)
 * HackerRank/LeetCode-style progress with level, time, steps
 */

import type { Difficulty } from '~/composables/useProblems'

const STORAGE_KEY_PREFIX = 'interview-agent-progress'

function getStorageKey(): string {
  if (typeof window === 'undefined') return `${STORAGE_KEY_PREFIX}-guest`
  try {
    const tokenCookie = document.cookie.split('; ').find((r) => r.startsWith('auth-token='))
    const token = tokenCookie?.split('=')[1]
    if (!token) return `${STORAGE_KEY_PREFIX}-guest`
    let h = 0
    for (let i = 0; i < token.length; i++) {
      const c = token.charCodeAt(i)
      h = ((h << 5) - h) + c
      h = h & h
    }
    const id = `user_${Math.abs(h).toString(36)}`
    return `${STORAGE_KEY_PREFIX}-${id}`
  } catch {
    return `${STORAGE_KEY_PREFIX}-guest`
  }
}

export type ProgressStep = 'attempted' | 'submitted' | 'accepted'

export type ProgressItem = {
  slug: string
  solvedAt: string
  language: string
  status: 'accepted' | 'attempted'
  /** Problem difficulty level */
  difficulty?: Difficulty
  /** Time taken to solve in milliseconds */
  timeTakenMs?: number
  /** Achievement steps: attempted → submitted → accepted (win) */
  steps?: ProgressStep[]
}

function loadProgress(): ProgressItem[] {
  if (typeof window === 'undefined') return []
  try {
    const key = getStorageKey()
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveProgress(items: ProgressItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey(), JSON.stringify(items))
}

const PROGRESS_STATE_KEY = 'interview-agent-progress-state'

export function useProgress() {
  const items = useState<ProgressItem[]>(PROGRESS_STATE_KEY, () => [])

  onMounted(() => {
    if (items.value.length === 0) {
      items.value = loadProgress()
    }
  })

  const solvedSlugs = computed(() =>
    items.value.filter((i) => i.status === 'accepted').map((i) => i.slug)
  )

  const attemptedSlugs = computed(() =>
    items.value.filter((i) => i.status === 'attempted').map((i) => i.slug)
  )

  /** Completed tasks (accepted) with full metadata for dashboard */
  const completedTasks = computed(() =>
    items.value
      .filter((i) => i.status === 'accepted')
      .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())
  )

  const stats = computed(() => ({
    solved: solvedSlugs.value.length,
    attempted: attemptedSlugs.value.length,
  }))

  function markSolved(slug: string, language: string, meta?: { difficulty?: Difficulty; timeTakenMs?: number }) {
    const existing = items.value.find((i) => i.slug === slug && i.status === 'accepted')
    if (!existing) {
      const steps: ProgressStep[] = ['attempted', 'submitted', 'accepted']
      items.value = [
        ...items.value.filter((i) => !(i.slug === slug && i.status === 'attempted')),
        {
          slug,
          solvedAt: new Date().toISOString(),
          language,
          status: 'accepted' as const,
          difficulty: meta?.difficulty,
          timeTakenMs: meta?.timeTakenMs,
          steps,
        },
      ]
      saveProgress(items.value)
    }
  }

  function markAttempted(slug: string, language: string) {
    if (!solvedSlugs.value.includes(slug)) {
      const filtered = items.value.filter((i) => i.slug !== slug || i.status !== 'attempted')
      items.value = [
        ...filtered,
        { slug, solvedAt: new Date().toISOString(), language, status: 'attempted' as const },
      ]
      saveProgress(items.value)
    }
  }

  function isSolved(slug: string) {
    return solvedSlugs.value.includes(slug)
  }

  function isAttempted(slug: string) {
    return attemptedSlugs.value.includes(slug) || solvedSlugs.value.includes(slug)
  }

  return {
    items,
    solvedSlugs,
    attemptedSlugs,
    completedTasks,
    stats,
    markSolved,
    markAttempted,
    isSolved,
    isAttempted,
  }
}
