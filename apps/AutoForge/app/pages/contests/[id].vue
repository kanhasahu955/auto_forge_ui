<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <div class="mb-6">
      <NuxtLink
        to="/contests"
        class="inline-flex items-center gap-2 text-app-muted hover:text-[var(--app-accent)] text-sm mb-4"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to contests
      </NuxtLink>
      <h1 class="text-2xl font-bold text-app">{{ contest?.title || contest?.slug || `Contest ${contestId}` }}</h1>
      <p v-if="contest?.start_time" class="text-app-muted text-sm mt-1">{{ formatDate(contest.start_time) }}</p>
    </div>

    <div v-if="loading" class="text-center py-12 text-app-muted">Loading...</div>
    <div v-else-if="error" class="p-4 rounded-xl bg-red-500/10 text-red-500">{{ error }}</div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 class="font-bold text-app mb-4 flex items-center gap-2">
            <Trophy class="w-5 h-5 text-violet-500" />
            Leaderboard
          </h2>
          <div v-if="leaderboard.length === 0" class="text-center py-8 text-app-muted text-sm">
            No entries yet
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(entry, i) in leaderboard"
              :key="entry.user_id || i"
              class="flex items-center gap-4 p-3 rounded-xl"
              :class="i < 3 ? 'bg-violet-500/10' : 'bg-[var(--app-surface-elevated)]/50'"
            >
              <span
                class="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0"
                :class="i === 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-600 dark:text-slate-400' : i === 2 ? 'bg-amber-700/20 text-amber-800 dark:text-amber-600' : 'bg-[var(--app-surface-elevated)] text-app-muted'"
              >
                {{ entry.rank ?? i + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <span class="font-medium text-app">{{ entry.username || entry.user_id || 'Anonymous' }}</span>
              </div>
              <span class="font-semibold text-[var(--app-accent)]">{{ entry.score ?? 0 }} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h3 class="font-bold text-app mb-4">About</h3>
          <p class="text-app-muted text-sm">
            Solve problems before time runs out. Your score is based on correct submissions and speed.
          </p>
          <NuxtLink
            to="/dsa"
            class="mt-4 inline-flex items-center gap-2 text-[var(--app-accent)] font-medium text-sm"
          >
            Practice problems
            <ChevronRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Trophy, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const contestId = computed(() => route.params.id as string)

const contestApi = useContestApi()
const contest = ref<{ id: string; title?: string; slug?: string; start_time?: string } | null>(null)
const leaderboard = ref<{ rank?: number; user_id?: string; username?: string; score?: number }[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [lbRes] = await Promise.all([
      contestApi.getLeaderboard(contestId.value),
    ])
    leaderboard.value = lbRes?.entries ?? []
    contest.value = { id: contestId.value }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

watch(contestId, load, { immediate: true })
</script>
