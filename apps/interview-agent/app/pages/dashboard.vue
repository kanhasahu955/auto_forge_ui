<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
    <div>
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-4">
          <span class="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
            <LayoutDashboard class="w-7 h-7 text-emerald-500" />
          </span>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-app tracking-tight">
              Dashboard
            </h1>
            <p class="text-app-muted mt-1 text-base sm:text-lg">
              Track your progress and completed challenges
            </p>
          </div>
        </div>
      </div>

      <!-- Congratulations + Certificate (only when user completes all problems) -->
      <div v-if="allCompleted" class="mb-10 space-y-6">
        <div class="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 p-6 sm:p-8 text-center">
          <Trophy class="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 class="text-2xl sm:text-3xl font-bold text-app mb-2">Congratulations!</h2>
          <p class="text-app-muted text-base sm:text-lg max-w-lg mx-auto">
            You've completed all {{ totalProblems }} problems. Here is your Certificate of Mastery.
          </p>
        </div>
        <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 max-w-xl mx-auto">
          <CertificateCard
            :user-name="user?.name"
            :solved-count="totalProblems"
            :total-problems="totalProblems"
          />
        </div>
      </div>

      <!-- Sign-in hint -->
      <div
        v-if="!isLoggedIn && completedTasksWithDetails.length > 0"
        class="mb-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 flex items-center gap-4 shadow-sm"
      >
        <span class="flex shrink-0 w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
          <CloudOff class="w-6 h-6 text-amber-500" />
        </span>
        <div class="flex-1">
          <p class="font-semibold text-amber-700 dark:text-amber-400">Progress saved locally</p>
          <p class="text-sm text-amber-600/90 dark:text-amber-400/80 mt-1">
            Sign in to sync across devices and never lose your wins.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div
          v-for="(stat, i) in dashboardStats"
          :key="stat.label"
          class="dashboard-stat-card group"
        >
          <div class="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-[var(--app-accent)]/50 group-hover:-translate-y-1">
            <span class="flex items-center justify-center w-14 h-14 rounded-2xl mb-4" :class="stat.bgClass">
              <component :is="stat.icon" class="w-7 h-7" :class="stat.color" />
            </span>
            <div class="text-3xl font-bold text-app" :class="stat.color">{{ stat.value }}</div>
            <div class="text-sm text-app-muted mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Completed Tasks -->
      <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 mb-10 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-[var(--app-border)]">
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15">
              <Trophy class="w-5 h-5 text-amber-500" />
            </span>
            <h2 class="text-xl font-bold text-app">Completed Tasks</h2>
          </div>
        </div>
        <div v-if="completedTasksWithDetails.length" class="space-y-4">
          <NuxtLink
            v-for="(task, i) in completedTasksWithDetails"
            :key="task.slug"
            :to="`/problems/${task.slug}`"
            class="dashboard-task-card group block"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] transition-all duration-300 group-hover:border-[var(--app-accent)] group-hover:shadow-lg group-hover:shadow-emerald-500/10">
              <div class="flex-1 min-w-0">
                <span class="text-app font-semibold text-lg">{{ task.title }}</span>
                <div class="flex flex-wrap items-center gap-3 mt-2">
                  <AppTag :type="difficultyType(task.difficulty)" size="small" class="!rounded-lg font-medium">
                    {{ task.difficulty }}
                  </AppTag>
                  <span v-if="task.timeTakenMs" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--app-surface)] text-app-muted text-sm">
                    <Timer class="w-3.5 h-3.5" /> {{ formatTime(task.timeTakenMs) }}
                  </span>
                </div>
              </div>
              <!-- Step flow: Attempted → Submitted → Win -->
              <div class="flex items-center gap-1 sm:gap-2 shrink-0">
                <template v-for="(step, idx) in stepLabels" :key="step.key">
                  <span v-if="idx > 0" class="text-app-muted text-sm hidden sm:inline">→</span>
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                    :class="hasStep(task, step.key)
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-[var(--app-surface)] text-app-muted'"
                  >
                    <CheckCircle2 v-if="hasStep(task, step.key)" class="w-3.5 h-3.5 shrink-0" />
                    <span v-else class="w-3.5 h-3.5 rounded-full border border-current" />
                    {{ step.label }}
                  </span>
                </template>
              </div>
            </div>
          </NuxtLink>
        </div>
        <AppEmpty
          v-else
          description="No completed tasks yet. Solve a problem and submit to see your wins here!"
          class="py-16"
        />
      </div>

      <!-- Quick actions -->
      <div class="flex flex-wrap gap-4">
        <NuxtLink to="/">
          <AppBtn variant="primary" size="large" class="!rounded-2xl shadow-lg shadow-emerald-500/20">
            <Library class="w-5 h-5 mr-2" />
            Browse Problems
          </AppBtn>
        </NuxtLink>
        <NuxtLink to="/assessment">
          <AppBtn variant="success" plain size="large" class="!rounded-2xl border-2">
            <Timer class="w-5 h-5 mr-2" />
            Start Timed Assessment
          </AppBtn>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloudOff, Trophy, Timer, Library, CheckCircle2, CircleDot, Hash, Percent, LayoutDashboard } from 'lucide-vue-next'

const { isLoggedIn, user } = useAuth()
const { problems } = useProblems()
const { stats, completedTasks } = useProgress()
const { allCompleted } = useLevels()

const totalProblems = computed(() => problems.length)
const solvedPercent = computed(() =>
  totalProblems.value ? Math.round((stats.value.solved / totalProblems.value) * 100) : 0
)

const stepLabels = [
  { key: 'attempted' as const, label: 'Attempted' },
  { key: 'submitted' as const, label: 'Submitted' },
  { key: 'accepted' as const, label: 'Win' },
]

const completedTasksWithDetails = computed(() =>
  completedTasks.value.map((task) => {
    const problem = problems.find((p) => p.slug === task.slug)
    return {
      ...task,
      title: problem?.title ?? task.slug,
      difficulty: task.difficulty ?? problem?.difficulty ?? 'easy',
    }
  })
)

const dashboardStats = computed(() => [
  { label: 'Problems Solved', value: stats.value.solved, color: 'text-emerald-500', bgClass: 'bg-emerald-500/15', icon: CheckCircle2 },
  { label: 'Attempted', value: stats.value.attempted, color: 'text-amber-500', bgClass: 'bg-amber-500/15', icon: CircleDot },
  { label: 'Total Problems', value: totalProblems.value, color: 'text-slate-400 dark:text-slate-300', bgClass: 'bg-slate-500/10', icon: Hash },
  { label: 'Completion', value: `${solvedPercent.value}%`, color: 'text-blue-500', bgClass: 'bg-blue-500/15', icon: Percent },
])

function difficultyType(d: string) {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  return 'danger'
}

function hasStep(task: { steps?: string[] }, key: string): boolean {
  if (task.steps?.includes(key)) return true
  if (!task.steps?.length) return true
  return false
}

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000)
  const min = Math.floor(sec / 60)
  if (min >= 1) {
    const s = sec % 60
    return s > 0 ? `${min}m ${s}s` : `${min}m`
  }
  return `${sec}s`
}
</script>
