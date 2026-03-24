<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative mb-8">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
      <div class="relative p-5 sm:p-6 lg:p-8">
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-violet-500/15 text-violet-500 w-fit mb-6">
          <Trophy class="w-4 h-4" />
          Compete & climb
        </span>
        <h1 class="text-3xl sm:text-4xl font-bold text-app mb-4">Contests</h1>
        <p class="text-app-muted max-w-xl">
          Join timed coding contests. Solve problems under pressure and climb the leaderboard.
        </p>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-12 text-app-muted">Loading contests...</div>
    <div v-else-if="error" class="p-4 rounded-xl bg-red-500/10 text-red-500 mb-6">{{ error }}</div>

    <!-- Contest list -->
    <div v-else class="space-y-4">
      <div
        v-for="contest in contests"
        :key="contest.id"
        class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 hover:border-[var(--app-accent)]/50 transition"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-app text-lg">{{ contest.title || contest.slug || `Contest ${contest.id}` }}</h2>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <AppTag v-if="contest.status" size="small">{{ contest.status }}</AppTag>
              <span v-if="contest.start_time" class="text-sm text-app-muted">
                {{ formatDate(contest.start_time) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              :to="`/contests/${contest.id}`"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)]/15 text-[var(--app-accent)] font-medium text-sm hover:bg-[var(--app-accent)]/25"
            >
              View
              <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <AppEmpty
        v-if="!loading && !error && contests.length === 0"
        description="No contests yet. Check back later for upcoming events."
        class="py-16"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, ChevronRight } from 'lucide-vue-next'

const contestApi = useContestApi()
const contests = ref<{ id: string; title?: string; slug?: string; status?: string; start_time?: string }[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await contestApi.listContests()
    contests.value = res?.items ?? []
  } catch (e) {
    error.value = (e as Error).message
    contests.value = []
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

onMounted(load)
</script>
