<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 mb-8">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-500/15 text-amber-500 w-fit mb-4">
        <Trophy class="w-4 h-4" />
        Global rankings
      </span>
      <h1 class="text-3xl sm:text-4xl font-bold text-app mb-2">Leaderboard</h1>
      <p class="text-app-muted">
        See how you rank against other practitioners. Solve more problems to climb!
      </p>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-12 text-app-muted">Loading...</div>
    <div v-else-if="error" class="p-4 rounded-xl bg-red-500/10 text-red-500 mb-6">{{ error }}</div>

    <!-- Leaderboard table -->
    <div v-else class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)]">
              <th class="text-left py-4 px-4 font-semibold text-app">Rank</th>
              <th class="text-left py-4 px-4 font-semibold text-app">User</th>
              <th class="text-right py-4 px-4 font-semibold text-app">Score</th>
              <th class="text-right py-4 px-4 font-semibold text-app hidden sm:table-cell">Solved</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, i) in leaderboard"
              :key="entry.user_id || i"
              class="border-b border-[var(--app-border)] last:border-b-0 hover:bg-[var(--app-surface-elevated)]/50"
            >
              <td class="py-4 px-4">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm"
                  :class="i === 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-600 dark:text-slate-400' : i === 2 ? 'bg-amber-700/20 text-amber-800 dark:text-amber-600' : 'bg-[var(--app-surface-elevated)] text-app-muted'"
                >
                  {{ entry.rank ?? i + 1 }}
                </span>
              </td>
              <td class="py-4 px-4 font-medium text-app">{{ entry.username || entry.user_id || 'Anonymous' }}</td>
              <td class="py-4 px-4 text-right font-semibold text-[var(--app-accent)]">{{ entry.score ?? 0 }}</td>
              <td class="py-4 px-4 text-right text-app-muted hidden sm:table-cell">{{ entry.total_solved ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppEmpty
        v-if="!loading && !error && leaderboard.length === 0"
        description="No entries yet. Be the first to solve problems and claim the top spot!"
        class="py-16"
      />
    </div>

    <div class="mt-6 flex justify-center">
      <NuxtLink
        to="/dsa"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--app-accent)]/15 text-[var(--app-accent)] font-medium hover:bg-[var(--app-accent)]/25"
      >
        <Play class="w-5 h-5" />
        Start practicing
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, Play } from 'lucide-vue-next'

const reportApi = useReportingApi()
const leaderboard = ref<{ rank?: number; user_id?: string; username?: string; score?: number; total_solved?: number }[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await reportApi.getLeaderboard()
    leaderboard.value = res?.entries ?? []
  } catch (e) {
    error.value = (e as Error).message
    leaderboard.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
