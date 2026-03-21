<script setup lang="ts">
import { Trophy, Award } from 'lucide-vue-next'

defineProps<{
  userName?: string
  solvedCount?: number
  totalProblems?: number
}>()
</script>

<template>
  <div class="certificate-card">
    <div class="certificate-border">
      <div class="certificate-inner">
        <div class="certificate-header">
          <Award class="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <h2 class="text-xl font-bold text-app">Certificate of Mastery</h2>
          <p class="text-app-muted text-sm mt-0.5">You've conquered all challenges!</p>
        </div>
        <div class="certificate-divider" />
        <div class="certificate-content">
          <p class="text-app text-center">
            This certifies that <strong class="text-[var(--app-accent)]">{{ userName ?? 'You' }}</strong> has successfully completed all
            <strong>{{ solvedCount ?? 0 }}/{{ totalProblems ?? 0 }}</strong> coding problems.
          </p>
          <p class="text-app-muted text-sm text-center mt-3">
            Completed on {{ new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>
        <div class="certificate-footer">
          <Trophy class="w-8 h-8 text-amber-400 mx-auto mb-1" />
          <p class="text-xs text-app-muted">Congratulations on your achievement!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificate-card {
  padding: 4px 0;
}

.certificate-border {
  border: 3px double var(--app-accent);
  border-radius: 12px;
  padding: 24px;
  background: linear-gradient(135deg, var(--app-surface-elevated) 0%, var(--app-surface) 100%);
}

.certificate-inner {
  text-align: center;
}

.certificate-header {
  margin-bottom: 16px;
}

.certificate-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--app-border), transparent);
  margin: 16px 0;
}

.certificate-content {
  text-align: center;
}

.certificate-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--app-border);
}
</style>
