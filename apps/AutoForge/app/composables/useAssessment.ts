/**
 * Assessment mode - timed coding test (iMocha/CodeSignal style)
 * Mock for now - will integrate with backend
 */

import type { Problem } from '~/composables/useProblems'
import { MOCK_PROBLEMS } from '~/composables/useProblems'

export type AssessmentState = {
  id: string
  problems: Problem[]
  currentIndex: number
  startedAt: number
  durationMinutes: number
  answers: Record<string, { code: string; language: string }>
}

export function useAssessment() {
  const state = useState<AssessmentState | null>('assessment-state', () => null)

  const currentProblem = computed(() => {
    if (!state.value?.problems?.length) return null
    const idx = state.value.currentIndex
    const problem = state.value.problems[idx]
    return problem && problem.slug ? problem : null
  })

  const timeRemaining = computed(() => {
    if (!state.value) return 0
    const startedAt = state.value.startedAt
    const mins = state.value.durationMinutes ?? 60
    if (!startedAt || Number.isNaN(startedAt) || Number.isNaN(mins)) return 0
    const elapsed = (Date.now() - startedAt) / 1000 / 60
    const remaining = mins - elapsed
    const result = Math.max(0, remaining)
    return Number.isNaN(result) ? 0 : result
  })

  const isTimeUp = computed(() => state.value && timeRemaining.value <= 0)

  const progress = computed(() => {
    if (!state.value?.problems?.length) return 0
    const idx = state.value.currentIndex + 1
    const total = state.value.problems.length
    return Math.round((idx / total) * 100)
  })

  function startAssessment(durationMinutes = 60, problemCount = 3) {
    const mins = Math.max(1, Math.min(Number(durationMinutes) || 60, 180))
    const count = Math.max(1, Math.min(Number(problemCount) || 3, 10))
    const list = Array.isArray(MOCK_PROBLEMS) && MOCK_PROBLEMS.length > 0
      ? MOCK_PROBLEMS
      : []
    const selected = list.slice(0, count)
    if (selected.length === 0) return null
    state.value = {
      id: `assessment-${Date.now()}`,
      problems: selected,
      currentIndex: 0,
      startedAt: Date.now(),
      durationMinutes: mins,
      answers: {},
    }
    return state.value
  }

  function setAnswer(slug: string, code: string, language: string) {
    if (state.value) {
      state.value.answers[slug] = { code, language }
    }
  }

  function nextProblem() {
    if (state.value && state.value.currentIndex < state.value.problems.length - 1) {
      state.value.currentIndex++
    }
  }

  function prevProblem() {
    if (state.value && state.value.currentIndex > 0) {
      state.value.currentIndex--
    }
  }

  function endAssessment() {
    state.value = null
  }

  const ASSESSMENT_DRAFT_KEY = 'autoforge-assessment-draft'

  /** Auto-save answers when timer ends - persist to localStorage so user doesn't lose work */
  function autoSaveOnTimeUp() {
    if (!state.value) return
    try {
      localStorage.setItem(ASSESSMENT_DRAFT_KEY, JSON.stringify(state.value))
    } catch {
      /* ignore */
    }
  }

  return {
    state,
    currentProblem,
    timeRemaining,
    progress,
    isTimeUp,
    startAssessment,
    setAnswer,
    nextProblem,
    prevProblem,
    endAssessment,
    autoSaveOnTimeUp,
  }
}
