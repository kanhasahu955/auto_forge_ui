<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative mb-8">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div class="relative grid lg:grid-cols-5 gap-6 p-5 sm:p-6 lg:p-8">
        <div class="lg:col-span-3">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-500 w-fit mb-6">
            <Flame class="w-4 h-4" />
            Practice tracks
          </span>
          <h1 class="text-3xl sm:text-4xl font-bold text-app mb-4">Structured learning paths</h1>
          <p class="text-app-muted max-w-xl mb-6">
            Follow topic-wise tracks. Build streaks and track your progress.
          </p>
          <div v-if="streak" class="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div class="text-center">
              <div class="text-2xl font-bold text-emerald-500">{{ streak.current_streak }}</div>
              <div class="text-xs text-app-muted">Current streak</div>
            </div>
            <div class="h-10 w-px bg-emerald-500/30" />
            <div class="text-center">
              <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ streak.longest_streak }}</div>
              <div class="text-xs text-app-muted">Longest streak</div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2 flex items-center">
          <NuxtLink
            to="/dsa"
            class="block w-full p-6 rounded-2xl border-2 border-dashed border-[var(--app-border)] hover:border-[var(--app-accent)] text-center transition"
          >
            <Code2 class="w-12 h-12 text-[var(--app-accent)] mx-auto mb-3" />
            <div class="font-bold text-app">DSA Problems</div>
            <div class="text-sm text-app-muted mt-1">Solve LeetCode-style challenges</div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Tracks -->
    <h2 class="text-lg font-bold text-app mb-4">Practice tracks</h2>
    <div v-if="loading" class="text-center py-12 text-app-muted">Loading...</div>
    <div v-else-if="error" class="p-4 rounded-xl bg-red-500/10 text-red-500 mb-6">{{ error }}</div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="track in tracks"
        :key="track.id"
        :to="`/dsa?track=${track.slug || track.id}`"
        class="block p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-accent)] transition"
      >
        <h3 class="font-bold text-app">{{ track.name || track.slug || `Track ${track.id}` }}</h3>
        <p v-if="track.description" class="text-sm text-app-muted mt-1 line-clamp-2">{{ track.description }}</p>
        <div v-if="track.question_count !== undefined" class="mt-3 text-sm text-[var(--app-accent)]">
          {{ track.question_count }} problems
        </div>
      </NuxtLink>

      <AppEmpty
        v-if="!loading && !error && tracks.length === 0"
        description="No tracks yet. Browse DSA problems to get started."
        class="col-span-full py-12"
      />
    </div>

    <div class="mt-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
      <h3 class="font-bold text-app mb-2">Quick links</h3>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/dsa" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)]/10 text-[var(--app-accent)] font-medium text-sm">
          DSA Problems
        </NuxtLink>
        <NuxtLink to="/dsa/assessment" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)]/10 text-[var(--app-accent)] font-medium text-sm">
          Timed Assessment
        </NuxtLink>
        <NuxtLink to="/leaderboard" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)]/10 text-[var(--app-accent)] font-medium text-sm">
          Leaderboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Flame, Code2 } from 'lucide-vue-next'

const practiceApi = usePracticeApi()
const tracks = ref<{ id: string; name?: string; slug?: string; description?: string; question_count?: number }[]>([])
const streak = ref<{ current_streak: number; longest_streak: number } | null>(null)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [tracksRes, streakRes] = await Promise.all([
      practiceApi.listTracks(),
      practiceApi.getMyStreak().catch(() => null),
    ])
    tracks.value = tracksRes?.items ?? []
    streak.value = streakRes
  } catch (e) {
    error.value = (e as Error).message
    tracks.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
