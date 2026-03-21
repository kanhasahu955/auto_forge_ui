<script setup lang="ts">
import { CheckCircle2, XCircle, Circle, Send } from 'lucide-vue-next'

defineProps<{
  status?: 'pass' | 'fail' | 'pending'
  progress?: number
  codeCoverage?: number
  accuracy?: number
  hasAnswer?: boolean
  testsPassed?: number
  testsTotal?: number
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 py-3 px-4 bg-[var(--app-surface-elevated)] rounded-xl border border-[var(--app-border)]">
    <!-- Status: Pass / Fail / Pending -->
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold text-app-muted uppercase tracking-wider">Status</span>
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
        :class="
          status === 'pass'
            ? 'bg-emerald-500/15 text-emerald-500'
            : status === 'fail'
              ? 'bg-red-500/15 text-red-500'
              : 'bg-[var(--app-surface)] text-app-muted'"
      >
        <CheckCircle2 v-if="status === 'pass'" class="w-3.5 h-3.5" />
        <XCircle v-else-if="status === 'fail'" class="w-3.5 h-3.5" />
        <Circle v-else class="w-3.5 h-3.5" />
        {{ status === 'pass' ? 'Pass' : status === 'fail' ? 'Fail' : 'Pending' }}
      </span>
    </div>

    <!-- Progress line -->
    <div class="flex items-center gap-2 flex-1 min-w-[120px]">
      <span class="text-xs font-semibold text-app-muted uppercase tracking-wider shrink-0">Progress</span>
      <div class="flex-1 h-2 rounded-full bg-[var(--app-surface)] overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="status === 'pass' ? 'bg-emerald-500' : status === 'fail' ? 'bg-red-500' : 'bg-[var(--app-accent)]'"
          :style="{ width: `${progress ?? 0}%` }"
        />
      </div>
      <span class="text-xs font-mono tabular-nums text-app shrink-0">{{ progress ?? 0 }}%</span>
    </div>

    <!-- Code coverage -->
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold text-app-muted uppercase tracking-wider">Coverage</span>
      <span class="text-xs font-mono font-medium tabular-nums text-app">{{ codeCoverage ?? 0 }}%</span>
    </div>

    <!-- Accuracy -->
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold text-app-muted uppercase tracking-wider">Accuracy</span>
      <span class="text-xs font-mono font-medium tabular-nums text-app">{{ accuracy ?? 0 }}%</span>
    </div>

    <!-- Answer -->
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold text-app-muted uppercase tracking-wider">Answer</span>
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
        :class="hasAnswer ? 'bg-emerald-500/15 text-emerald-500' : 'bg-[var(--app-surface)] text-app-muted'"
      >
        <Send class="w-3.5 h-3.5" />
        {{ hasAnswer ? 'Submitted' : 'Not yet' }}
      </span>
    </div>
  </div>
</template>
