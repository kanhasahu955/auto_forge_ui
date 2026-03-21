<script setup lang="ts">
import { Trophy, Award } from 'lucide-vue-next'

const props = defineProps<{
  visible: boolean
  problemTitle?: string
  difficulty?: string
  solvedAt?: string
  timeTakenMs?: number
  language?: string
}>()

const emit = defineEmits<{ (e: 'update:visible', v: boolean): void }>()

const router = useRouter()

function close() {
  emit('update:visible', false)
}

function goToDashboard() {
  close()
  router.push('/dashboard')
}

function formatTime(ms?: number) {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const ss = s % 60
  return m > 0 ? `${m}m ${ss}s` : `${ss}s`
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const certificateRef = ref<HTMLElement | null>(null)
</script>

<template>
  <AppDialog
    :model-value="visible"
    title="Certificate"
    width="420px"
    :show-close="true"
    append-to-body
    destroy-on-close
    class="certificate-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <div ref="certificateRef" class="certificate-body">
      <div class="certificate-border">
        <div class="certificate-inner">
          <div class="certificate-header">
            <Award class="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <h2 class="text-xl font-bold text-app">Certificate of Completion</h2>
            <p class="text-app-muted text-sm mt-0.5">You've mastered this challenge!</p>
          </div>
          <div class="certificate-divider" />
          <div class="certificate-content space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-app-muted">Problem</span>
              <span class="font-semibold text-app">{{ problemTitle ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-app-muted">Difficulty</span>
              <span class="font-medium capitalize text-app">{{ difficulty ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-app-muted">Completed</span>
              <span class="text-app">{{ formatDate(solvedAt) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-app-muted">Time taken</span>
              <span class="text-app">{{ formatTime(timeTakenMs) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-app-muted">Language</span>
              <span class="text-app capitalize">{{ language ?? '—' }}</span>
            </div>
          </div>
          <div class="certificate-footer">
            <Trophy class="w-8 h-8 text-amber-400 mx-auto mb-1" />
            <p class="text-xs text-app-muted">Congratulations! Keep learning.</p>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <AppBtn variant="outline" @click="close">Close</AppBtn>
        <AppBtn variant="primary" @click="goToDashboard">
          <Trophy class="w-3.5 h-3.5 mr-1.5" />
          View Dashboard
        </AppBtn>
      </div>
    </template>
  </AppDialog>
</template>

<style scoped>
.certificate-dialog :deep(.el-dialog__body) {
  padding: 0 24px 16px;
}

.certificate-body {
  padding: 8px 0;
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
  text-align: left;
}

.certificate-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--app-border);
}
</style>
