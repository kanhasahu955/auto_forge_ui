/**
 * Level-based unlock logic
 * Level 1 always unlocked; Level N unlocks when all problems in levels 1..N-1 are solved
 */

import type { Problem } from './useProblems'

export function useLevels() {
  const { problems } = useProblems()
  const { solvedSlugs } = useProgress()

  const maxLevel = computed(() =>
    Math.max(0, ...problems.map((p) => p.level ?? 1))
  )

  const problemsByLevel = computed(() => {
    const map = new Map<number, Problem[]>()
    for (const p of problems) {
      const lv = p.level ?? 1
      if (!map.has(lv)) map.set(lv, [])
      map.get(lv)!.push(p)
    }
    const levels = Array.from(map.keys()).sort((a, b) => a - b)
    return levels.map((lv) => ({ level: lv, problems: map.get(lv)! }))
  })

  function isLevelUnlocked(level: number): boolean {
    if (level <= 1) return true
    for (let lv = 1; lv < level; lv++) {
      const probsInLevel = problems.filter((p) => (p.level ?? 1) === lv)
      const allSolved = probsInLevel.every((p) => solvedSlugs.value.includes(p.slug))
      if (!allSolved) return false
    }
    return true
  }

  function canAccessProblem(slug: string): boolean {
    const problem = problems.find((p) => p.slug === slug)
    if (!problem) return false
    return isLevelUnlocked(problem.level ?? 1)
  }

  function getNextProblemInLevel(slug: string): Problem | null {
    const problem = problems.find((p) => p.slug === slug)
    if (!problem) return null
    const level = problem.level ?? 1
    const inLevel = problems.filter((p) => (p.level ?? 1) === level)
    const idx = inLevel.findIndex((p) => p.slug === slug)
    if (idx < 0 || idx >= inLevel.length - 1) return null
    return inLevel[idx + 1]
  }

  /** Next problem in level order; if at end of level, first of next level */
  function getNextProblemInOrder(slug: string): Problem | null {
    const idx = problems.findIndex((p) => p.slug === slug)
    if (idx < 0 || idx >= problems.length - 1) return null
    return problems[idx + 1]
  }

  const totalProblems = computed(() => problems.length)
  const solvedCount = computed(() => solvedSlugs.value.length)
  const allCompleted = computed(() => solvedCount.value >= totalProblems.value)

  return {
    problemsByLevel,
    maxLevel,
    isLevelUnlocked,
    canAccessProblem,
    getNextProblemInLevel,
    getNextProblemInOrder,
    totalProblems,
    solvedCount,
    allCompleted,
  }
}
