<script setup lang="ts">
import { Code2, CheckCircle2, Trophy, Award } from 'lucide-vue-next'

const steps = [
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'pass', label: 'Pass tests', icon: CheckCircle2 },
  { id: 'winner', label: 'Winner', icon: Trophy },
  { id: 'certificate', label: 'Certificate', icon: Award },
] as const

export type StepId = (typeof steps)[number]['id']

defineProps<{
  currentStep: StepId
  completedSteps?: StepId[]
}>()
</script>

<template>
  <div class="flex items-center justify-between gap-2 py-3 px-4 bg-[var(--app-surface-elevated)] rounded-xl border border-[var(--app-border)]">
    <div
      v-for="(step, idx) in steps"
      :key="step.id"
      class="flex items-center gap-2 flex-1 min-w-0"
    >
      <div
        class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
        :class="
          completedSteps?.includes(step.id)
            ? 'bg-emerald-500/15 text-emerald-500'
            : currentStep === step.id
              ? 'bg-[var(--app-accent)]/15 text-[var(--app-accent)]'
              : 'bg-[var(--app-surface)] text-app-muted'
        "
      >
        <component :is="step.icon" class="w-3.5 h-3.5 shrink-0" />
        <span class="truncate">{{ step.label }}</span>
      </div>
      <div
        v-if="idx < steps.length - 1"
        class="w-4 h-px shrink-0"
        :class="completedSteps?.includes(step.id) ? 'bg-emerald-500/50' : 'bg-[var(--app-border)]'"
      />
    </div>
  </div>
</template>
