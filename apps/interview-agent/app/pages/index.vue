<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="mb-5 sm:mb-6">
      <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative">
        <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div class="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
        <div class="relative grid lg:grid-cols-5 gap-6 lg:gap-8 p-5 sm:p-6 lg:p-8">
          <div class="lg:col-span-3 flex flex-col justify-center">
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--app-accent)]/15 text-[var(--app-accent)] w-fit mb-6">
              <Sparkles class="w-4 h-4" />
              LeetCode · CodeSignal · iMocha
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-app mb-5 leading-[1.1] tracking-tight">
              Master coding
              <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
                one problem at a time
              </span>
            </h1>
            <p class="text-app-muted text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Solve algorithmic challenges, track your progress, and ace your next technical interview.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/problems/two-sum">
                <AppBtn variant="primary" size="large" class="!rounded-2xl shadow-xl shadow-emerald-500/20">
                  <Play class="w-5 h-5 mr-2" />
                  Start with Two Sum
                </AppBtn>
              </NuxtLink>
              <NuxtLink to="/assessment">
                <AppBtn variant="secondary" size="large" class="!rounded-2xl border-2">
                  <Timer class="w-5 h-5 mr-2" />
                  Timed Assessment
                </AppBtn>
              </NuxtLink>
            </div>
          </div>
          <div class="lg:col-span-2 flex flex-col justify-center">
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
              <div v-for="stat in statCards" :key="stat.label" class="contents">
                <NuxtLink
                  v-if="stat.link"
                  :to="stat.link"
                  class="group block"
                >
                  <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80 transition-all duration-300 group-hover:border-[var(--app-accent)] group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                    <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3" :class="stat.bgClass">
                      <component :is="stat.icon" class="w-5 h-5 sm:w-6 sm:h-6" :class="stat.color" />
                    </span>
                    <div class="text-xl sm:text-2xl font-bold text-app" :class="stat.color">{{ stat.value }}</div>
                    <div class="text-xs sm:text-sm text-app-muted">{{ stat.label }}</div>
                  </div>
                </NuxtLink>
                <div v-else class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
                  <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3" :class="stat.bgClass">
                    <component :is="stat.icon" class="w-5 h-5 sm:w-6 sm:h-6" :class="stat.color" />
                  </span>
                  <div class="text-xl sm:text-2xl font-bold text-app" :class="stat.color">{{ stat.value }}</div>
                  <div class="text-xs sm:text-sm text-app-muted">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters + Search -->
    <div class="mb-4 space-y-3">
      <div class="flex flex-col sm:flex-row flex-wrap gap-3">
        <AppInput
          v-model="searchQuery"
          placeholder="Search by title or tag..."
          class="flex-1 min-w-[200px]"
          clearable
        />
        <AppSelect v-model="filterDifficulty" placeholder="Difficulty" class="w-full sm:w-36" clearable>
          <AppOption label="All" value="" />
          <AppOption label="Easy" value="easy" />
          <AppOption label="Medium" value="medium" />
          <AppOption label="Hard" value="hard" />
        </AppSelect>
        <AppSelect v-model="filterStatus" placeholder="Status" class="w-full sm:w-36" clearable>
          <AppOption label="All" value="" />
          <AppOption label="Solved" value="solved" />
          <AppOption label="Attempted" value="attempted" />
          <AppOption label="To Do" value="todo" />
        </AppSelect>
        <AppSelect v-model="sortBy" placeholder="Sort by" class="w-full sm:w-40">
          <AppOption label="Default" value="default" />
          <AppOption label="Difficulty (Easy first)" value="difficulty-asc" />
          <AppOption label="Acceptance (High first)" value="acceptance-desc" />
          <AppOption label="Title A-Z" value="title-asc" />
        </AppSelect>
        <AppBtn
          v-if="hasActiveFilters"
          variant="ghost"
          size="small"
          @click="clearFilters"
          class="shrink-0"
        >
          Clear filters
        </AppBtn>
      </div>

      <!-- Tag chips -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
          :class="filterTag === tag
            ? 'bg-[var(--app-accent)] text-white shadow-sm'
            : 'bg-[var(--app-surface-elevated)] text-app-muted border border-[var(--app-border)] hover:border-[var(--app-accent)]/50 hover:text-app'"
          @click="filterTag = filterTag === tag ? '' : tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Problems by level -->
    <div class="space-y-5">
      <div
        v-for="group in filteredProblemsByLevel"
        :key="group.level"
        class="rounded-2xl border overflow-hidden shadow-sm"
        :class="isLevelUnlocked(group.level)
          ? 'border-[var(--app-border)] bg-[var(--app-surface)]'
          : 'border-[var(--app-border)] bg-[var(--app-surface)]/60 opacity-90'"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b"
          :class="isLevelUnlocked(group.level) ? 'border-[var(--app-border)] bg-[var(--app-surface-elevated)]' : 'border-[var(--app-border)]'"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold shrink-0"
              :class="isLevelUnlocked(group.level)
                ? 'bg-[var(--app-accent)]/15 text-[var(--app-accent)]'
                : 'bg-[var(--app-surface-elevated)] text-app-muted'"
            >
              <Lock v-if="!isLevelUnlocked(group.level)" class="w-5 h-5" />
              <span v-else>{{ group.level }}</span>
            </span>
            <div>
              <h2 class="text-lg font-bold text-app">Level {{ group.level }}</h2>
              <p class="text-sm text-app-muted">
                {{ isLevelUnlocked(group.level)
                  ? `Complete all ${group.problems.length} problem(s) to unlock Level ${group.level + 1}`
                  : `Complete Level ${group.level - 1} first` }}
              </p>
            </div>
          </div>
          <div v-if="isLevelUnlocked(group.level)" class="flex items-center gap-2">
            <span class="text-sm text-app-muted">
              {{ group.problems.filter((p) => isSolved(p.slug)).length }}/{{ group.problems.length }} solved
            </span>
          </div>
        </div>
        <div class="divide-y divide-[var(--app-border)]">
          <NuxtLink
            v-for="p in group.problems"
            :key="p.id"
            :to="isLevelUnlocked(group.level) ? `/problems/${p.slug}` : '#'"
            class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 transition-colors"
            :class="[
              !isLevelUnlocked(group.level) ? 'pointer-events-none cursor-not-allowed opacity-60' : 'group hover:bg-[var(--app-surface-elevated)]/50',
              { 'border-l-4 border-l-[var(--app-accent)] bg-emerald-500/5': isSolved(p.slug) },
            ]"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--app-surface-elevated)] text-app-muted text-sm font-bold shrink-0">
                {{ p.id }}
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-app font-semibold text-base sm:text-lg">
                    {{ p.title }}
                  </span>
                  <AppTag v-if="isSolved(p.slug)" type="success" size="small" class="!rounded-lg shrink-0">
                    ✓ Solved
                  </AppTag>
                  <AppTag v-else-if="isAttempted(p.slug)" type="warning" size="small" class="!rounded-lg shrink-0">
                    Attempted
                  </AppTag>
                </div>
                <div class="flex flex-wrap items-center gap-2 mt-1.5">
                  <AppTag :type="difficultyType(p.difficulty)" size="small" class="!rounded-lg">
                    {{ p.difficulty }}
                  </AppTag>
                  <span
                    v-for="tag in p.tags"
                    :key="tag"
                    class="text-xs px-2 py-0.5 rounded-md bg-[var(--app-surface-elevated)] text-app-muted"
                  >
                    {{ tag }}
                  </span>
                  <span class="text-app-muted text-xs sm:text-sm">{{ p.acceptanceRate }}% accepted</span>
                </div>
              </div>
            </div>
            <div v-if="isLevelUnlocked(group.level)" class="flex items-center gap-4 shrink-0 pl-11 sm:pl-0">
              <span
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)]/10 text-[var(--app-accent)] font-medium text-sm group-hover:bg-[var(--app-accent)]/20 transition-colors"
              >
                Open
                <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- All complete: link to Dashboard for certificate -->
    <div
      v-if="allCompleted"
      class="mt-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 p-6 text-center"
    >
      <Award class="w-12 h-12 text-emerald-500 mx-auto mb-3" />
      <h3 class="text-lg font-bold text-app mb-1">You've completed all problems!</h3>
      <p class="text-app-muted text-sm mb-4">View your certificate on your Dashboard.</p>
      <NuxtLink to="/dashboard">
        <AppBtn variant="primary" size="default">
          <LayoutDashboard class="w-4 h-4 mr-2" />
          Go to Dashboard
        </AppBtn>
      </NuxtLink>
    </div>

    <AppEmpty v-if="filteredProblemsByLevel.length === 0" description="No problems match your filters. Try adjusting your search or filters." class="py-16" />
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Play, Timer, CheckCircle2, CircleDot, Hash, LayoutDashboard, ChevronRight, Lock, Award } from 'lucide-vue-next'

const { problems } = useProblems()
const { stats, isSolved, isAttempted } = useProgress()
const { problemsByLevel, isLevelUnlocked, allCompleted } = useLevels()

const filteredProblemsByLevel = computed(() => {
  return problemsByLevel.value.map((group) => {
    let probs = group.problems
    if (filterDifficulty.value) probs = probs.filter((p) => p.difficulty === filterDifficulty.value)
    if (filterTag.value) probs = probs.filter((p) => p.tags?.includes(filterTag.value))
    if (filterStatus.value === 'solved') probs = probs.filter((p) => isSolved(p.slug))
    else if (filterStatus.value === 'attempted') probs = probs.filter((p) => isAttempted(p.slug) && !isSolved(p.slug))
    else if (filterStatus.value === 'todo') probs = probs.filter((p) => !isAttempted(p.slug))
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      probs = probs.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    }
    probs = sortProblems(probs)
    return { level: group.level, problems: probs }
  }).filter((g) => g.problems.length > 0)
})

const filterDifficulty = ref('')
const filterStatus = ref('')
const filterTag = ref('')
const searchQuery = ref('')
const sortBy = ref('default')

const problemList = computed(() => (Array.isArray(problems) ? problems : []))

const allTags = computed(() => {
  const tags = new Set<string>()
  problemList.value.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
})

const hasActiveFilters = computed(
  () => !!filterDifficulty.value || !!filterStatus.value || !!filterTag.value || !!searchQuery.value.trim()
)

const statCards = computed(() => [
  { label: 'Solved', value: stats.value.solved, color: 'text-emerald-500', bgClass: 'bg-emerald-500/15', icon: CheckCircle2 },
  { label: 'Attempted', value: stats.value.attempted, color: 'text-amber-500', bgClass: 'bg-amber-500/15', icon: CircleDot },
  { label: 'Total', value: problemList.value.length, color: 'text-slate-400 dark:text-slate-300', bgClass: 'bg-slate-500/10', icon: Hash },
  { label: 'Dashboard', value: '→', color: 'text-emerald-500', bgClass: 'bg-emerald-500/15', icon: LayoutDashboard, link: '/dashboard' },
])

function sortProblems<T extends { difficulty: string; acceptanceRate?: number; title: string }>(list: T[]): T[] {
  const key = sortBy.value
  if (key === 'difficulty-asc') {
    const order = { easy: 0, medium: 1, hard: 2 }
    return [...list].sort((a, b) => (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0))
  }
  if (key === 'acceptance-desc') return [...list].sort((a, b) => (b.acceptanceRate ?? 0) - (a.acceptanceRate ?? 0))
  if (key === 'title-asc') return [...list].sort((a, b) => a.title.localeCompare(b.title))
  return list
}

function clearFilters() {
  filterDifficulty.value = ''
  filterStatus.value = ''
  filterTag.value = ''
  searchQuery.value = ''
}

function difficultyType(d: string) {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  return 'danger'
}
</script>

