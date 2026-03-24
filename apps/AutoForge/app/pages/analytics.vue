<template>
  <div class="dash-page px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="dash-page-header mb-10">
      <h1>Analytics</h1>
      <p>Overview of your progress, leaderboard standings, and practice stats.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      <AppCard v-for="stat in analyticsStats" :key="stat.label" class="dash-stat-card">
        <p class="text-xl font-semibold" :class="stat.color">{{ stat.value }}</p>
        <p class="text-xs text-[var(--app-text-muted)] mt-0.5">{{ stat.label }}</p>
      </AppCard>
    </div>

    <!-- Leaderboard -->
    <AppCard class="dash-section-card mb-10">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Top rankings</span>
          <NuxtLink to="/leaderboard" class="text-sm text-[var(--app-accent)] hover:underline font-medium">
            View full →
          </NuxtLink>
        </div>
      </template>
      <div v-if="leaderboardLoading" class="py-12 flex flex-col items-center gap-2">
        <div class="w-8 h-8 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-[var(--app-text-muted)]">Loading...</p>
      </div>
      <div v-else-if="!leaderboard.length" class="py-12 text-center">
        <p class="text-sm text-[var(--app-text-muted)]">No leaderboard entries yet. Start solving problems!</p>
      </div>
      <AppTable v-else :data="leaderboard" stripe size="small">
        <AppTableColumn prop="rank" label="Rank" width="72">
          <template #default="{ row, $index }">
            <AppTag
              :type="($index === 0 ? 'warning' : $index === 1 ? 'info' : $index === 2 ? 'danger' : 'info')"
              effect="plain"
              size="small"
            >
              {{ row.rank ?? $index + 1 }}
            </AppTag>
          </template>
        </AppTableColumn>
        <AppTableColumn prop="username" label="User">
          <template #default="{ row }">
            {{ row.username || row.user_id || 'Anonymous' }}
          </template>
        </AppTableColumn>
        <AppTableColumn prop="score" label="Score" align="right" width="80" />
        <AppTableColumn prop="total_solved" label="Solved" align="right" width="80" />
      </AppTable>
    </AppCard>

    <!-- Quick links -->
    <h2 class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-4">More insights</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink to="/dsa/dashboard">
        <AppCard class="dash-link-card">
          <p class="font-medium text-[var(--app-text)] text-sm">DSA Dashboard</p>
          <p class="text-xs text-[var(--app-text-muted)] mt-0.5">Track problem completion</p>
        </AppCard>
      </NuxtLink>
      <NuxtLink to="/practice">
        <AppCard class="dash-link-card">
          <p class="font-medium text-[var(--app-text)] text-sm">Practice Streak</p>
          <p class="text-xs text-[var(--app-text-muted)] mt-0.5">View streaks and tracks</p>
        </AppCard>
      </NuxtLink>
      <NuxtLink to="/leaderboard">
        <AppCard class="dash-link-card">
          <p class="font-medium text-[var(--app-text)] text-sm">Leaderboard</p>
          <p class="text-xs text-[var(--app-text-muted)] mt-0.5">Full rankings</p>
        </AppCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgress } from '~/composables/useProgress'
import { useProblems } from '~/composables/useProblems'
import { usePracticeApi } from '~/composables/usePracticeApi'
import { useReportingApi } from '~/composables/useReportingApi'

definePageMeta({ layout: 'default' })

const { problems } = useProblems()
const { stats } = useProgress()
const practiceApi = usePracticeApi()
const reportApi = useReportingApi()

const leaderboard = ref<{ rank?: number; user_id?: string; username?: string; score?: number; total_solved?: number }[]>([])
const leaderboardLoading = ref(true)
const streak = ref<{ current_streak: number; longest_streak: number } | null>(null)

const totalProblems = computed(() => problems.length)
const solvedPercent = computed(() =>
  totalProblems.value ? Math.round((stats.value.solved / totalProblems.value) * 100) : 0
)

const analyticsStats = computed(() => [
  { label: 'Solved', value: stats.value.solved, color: 'text-[var(--app-accent)]' },
  { label: 'Attempted', value: stats.value.attempted, color: 'text-amber-500' },
  { label: 'Completion', value: `${solvedPercent.value}%`, color: 'text-blue-500' },
  { label: 'Streak', value: streak.value?.current_streak ?? '—', color: 'text-amber-500' },
])

async function loadLeaderboard() {
  leaderboardLoading.value = true
  try {
    const res = await reportApi.getLeaderboard({ limit: 10 })
    leaderboard.value = res?.entries ?? []
  } catch {
    leaderboard.value = []
  } finally {
    leaderboardLoading.value = false
  }
}

async function loadStreak() {
  try {
    streak.value = await practiceApi.getMyStreak()
  } catch {
    streak.value = null
  }
}

onMounted(() => {
  loadLeaderboard()
  loadStreak()
})
</script>
