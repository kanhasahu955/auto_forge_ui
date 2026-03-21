<template>
  <!-- Start new assessment -->
  <div v-if="!assessment.state" class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto min-h-[70vh]">
    <div class="mb-8 sm:mb-10">
      <div class="flex items-center gap-4">
        <span class="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 shrink-0">
          <Timer class="w-7 h-7 text-amber-500" />
        </span>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-app tracking-tight">Timed Assessment</h1>
          <p class="text-app-muted mt-1 text-base sm:text-lg">
            iMocha / CodeSignal style – Solve assigned problems within a time limit. Auto-saves when time runs out.
          </p>
        </div>
      </div>
    </div>
    <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 shadow-sm">
      <h2 class="text-lg font-semibold text-app mb-6">Start a new assessment</h2>
      <div class="grid sm:grid-cols-2 gap-6 max-w-xl">
        <div>
          <label class="block text-sm font-medium text-app-muted mb-2">Duration</label>
          <AppSelect v-model="duration" class="w-full">
            <AppOption label="30 minutes" :value="30" />
            <AppOption label="60 minutes" :value="60" />
            <AppOption label="90 minutes" :value="90" />
            <AppOption label="120 minutes" :value="120" />
          </AppSelect>
        </div>
        <div>
          <label class="block text-sm font-medium text-app-muted mb-2">Number of problems</label>
          <AppSelect v-model="problemCount" class="w-full">
            <AppOption label="2 problems" :value="2" />
            <AppOption label="3 problems" :value="3" />
            <AppOption label="5 problems" :value="5" />
          </AppSelect>
        </div>
      </div>
      <button
        type="button"
        class="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-[var(--app-accent)] text-white shadow-lg shadow-emerald-500/25 hover:opacity-90 transition-opacity"
        @click.prevent="handleStartAssessment"
      >
        <Play class="w-4 h-4" />
        Start Assessment
      </button>
    </div>
  </div>

  <!-- Assessment workspace: Timer + Sidebar + Problem/Editor -->
  <div
    v-else-if="(assessment.state?.problems?.length ?? 0) > 0"
    class="h-[calc(100vh-4rem)] flex flex-col"
  >
    <!-- Timer bar (top) -->
    <div class="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-[var(--app-border)] bg-[var(--app-surface)] shrink-0">
      <div
        class="text-2xl sm:text-3xl font-mono font-bold tabular-nums min-w-[5rem]"
        :class="assessment.timeRemaining <= 2 ? 'text-red-500 animate-pulse' : 'text-emerald-500'"
      >
        {{ formatTime(assessment.timeRemaining) }}
      </div>
      <AppProgress :percentage="assessment.progress" :stroke-width="6" class="flex-1 max-w-[200px] sm:max-w-[280px]" />
      <span class="text-sm text-app-muted shrink-0">
        {{ (assessment.state?.currentIndex ?? 0) + 1 }} / {{ assessment.state?.problems?.length ?? 0 }}
      </span>
      <AppBtn variant="danger" size="small" plain @click="assessment.endAssessment" class="shrink-0">
        <Square class="w-4 h-4 mr-1" />
        End
      </AppBtn>
    </div>

    <!-- Main: Sidebar + Content -->
    <div class="flex-1 flex min-h-0">
      <!-- Left sidebar: assigned problems -->
      <aside class="w-52 sm:w-64 border-r border-[var(--app-border)] bg-[var(--app-surface-elevated)] overflow-y-auto shrink-0">
        <div class="p-3 border-b border-[var(--app-border)]">
          <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider">Assigned Tasks</h3>
        </div>
        <div class="divide-y divide-[var(--app-border)]">
          <button
            v-for="(p, i) in assessment.state?.problems ?? []"
            :key="p.slug"
            type="button"
            class="w-full text-left px-3 py-2.5 text-sm transition-colors"
            :class="assessment.state?.currentIndex === i
              ? 'bg-[var(--app-accent)]/15 text-[var(--app-accent)] font-medium border-l-2 border-l-[var(--app-accent)]'
              : 'text-app-muted hover:bg-[var(--app-surface)] hover:text-app'"
            @click="assessment.state && (assessment.state.currentIndex = i)"
          >
            <span class="font-mono text-app-muted mr-2">{{ i + 1 }}.</span>
            {{ p.title }}
          </button>
        </div>
      </aside>

      <!-- Right: Problem description + Editor -->
      <div class="flex-1 flex flex-col lg:flex-row min-h-0">
        <!-- Problem description -->
        <div v-if="currentProblem" class="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[var(--app-border)] overflow-auto bg-[var(--app-surface-elevated)] flex-shrink-0">
          <div class="p-4 sm:p-6">
            <div class="flex items-center gap-2 mb-4">
              <h2 class="text-lg font-semibold text-app">{{ currentProblem.title }}</h2>
              <AppTag :type="difficultyType(currentProblem.difficulty)" size="small">
                {{ currentProblem.difficulty }}
              </AppTag>
            </div>
            <div class="space-y-4 text-sm" style="font-family: var(--font-mono)">
              <section>
                <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Description</h3>
                <div class="text-app whitespace-pre-wrap leading-relaxed">{{ currentProblem.description }}</div>
              </section>
              <section>
                <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Constraints</h3>
                <ul class="list-disc list-inside text-app-muted space-y-1">
                  <li v-for="(c, j) in currentProblem.constraints" :key="j">{{ c }}</li>
                </ul>
              </section>
              <section>
                <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Sample Input</h3>
                <pre class="p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-accent)] overflow-x-auto">{{ currentProblem.sampleInput }}</pre>
              </section>
              <section>
                <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Sample Output</h3>
                <pre class="p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-accent)] overflow-x-auto">{{ currentProblem.sampleOutput }}</pre>
              </section>
            </div>
          </div>
        </div>

        <!-- Editor + Output -->
        <div v-if="currentProblem" class="lg:w-1/2 flex flex-col min-h-0 flex-1">
          <div class="flex items-center justify-end gap-2 px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-surface)] shrink-0">
            <AppBtn variant="success" size="small" @click="runCode">
              <Play class="w-3.5 h-3.5 mr-1" />
              Run
            </AppBtn>
            <AppBtn variant="primary" size="small" @click="submitCode">
              <Send class="w-3.5 h-3.5 mr-1" />
              Submit
            </AppBtn>
          </div>
          <CodeEditor
            :model-value="getAnswer(currentProblem.slug).code"
            @update:model-value="onCodeChange(currentProblem.slug, $event)"
            :language="getAnswer(currentProblem.slug).language"
            :languages="languages"
            @update:language="onLangChange(currentProblem.slug, $event)"
            class="flex-1 min-h-[180px]"
          />
          <div class="border-t border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shrink-0">
            <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Output</h3>
            <pre
              class="output-pre text-sm font-mono overflow-auto max-h-32 p-4 rounded-xl min-h-[3rem]"
              :class="runStatus === 'passed' ? 'text-emerald-500' : runStatus === 'failed' ? 'text-red-500' : 'text-app-muted'"
            >{{ output }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Time's up overlay -->
    <AppDialog
      :model-value="showTimeUpDialog"
      title="Time's up!"
      width="380px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <p class="text-app-muted">Your work has been auto-saved. You can view your saved answers later.</p>
      <template #footer>
        <AppBtn variant="primary" @click="handleTimeUpClose">OK</AppBtn>
      </template>
    </AppDialog>
  </div>

  <!-- Fallback -->
  <div v-else class="min-h-[60vh] flex items-center justify-center p-8">
    <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
      <p class="text-app-muted mb-4">Your assessment session was reset. Start a new one.</p>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-[var(--app-accent)] text-white hover:opacity-90 transition-opacity"
        @click.prevent="handleStartNewAssessment"
      >
        <Play class="w-4 h-4" />
        Start New Assessment
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Timer, Play, Square, Send } from 'lucide-vue-next'

const assessment = useAssessment()
const { markSolved, markAttempted } = useProgress()
const { run: runUserCode } = useCodeRunner()

onMounted(() => {
  const s = unref(assessment.state)
  if (s && (!Array.isArray(s.problems) || s.problems.length === 0)) {
    assessment.endAssessment()
  }
})

const duration = ref(60)
const problemCount = ref(3)
const showTimeUpDialog = ref(false)

function handleStartAssessment() {
  const mins = Number(duration.value) || 60
  const count = Number(problemCount.value) || 3
  assessment.startAssessment(mins, count)
}

function handleStartNewAssessment() {
  assessment.endAssessment()
  nextTick(() => {
    assessment.startAssessment(60, 3)
  })
}

const currentProblem = computed(() => assessment.currentProblem)

const languages = ['go', 'javascript', 'python', 'typescript']

function getAnswer(slug: string) {
  const state = unref(assessment.state)
  if (!state) return { code: '', language: 'python' }
  const p = state.problems.find((x: { slug: string }) => x.slug === slug)
  if (!p) return { code: '', language: 'python' }
  const saved = state.answers[slug]
  if (saved) return saved
  state.answers[slug] = {
    code: p.templateCode?.python ?? p.templateCode?.javascript ?? p.templateCode?.typescript ?? p.templateCode?.go ?? '',
    language: 'python',
  }
  return state.answers[slug]
}

function onCodeChange(slug: string, code: string) {
  const ans = getAnswer(slug)
  assessment.setAnswer(slug, code, ans.language)
}

function onLangChange(slug: string, lang: string) {
  const state = unref(assessment.state)
  const p = state?.problems?.find((x: { slug: string }) => x.slug === slug)
  const template = p?.templateCode?.[lang] ?? p?.templateCode?.python ?? p?.templateCode?.javascript ?? p?.templateCode?.typescript ?? p?.templateCode?.go ?? ''
  assessment.setAnswer(slug, template, lang)
}

const output = ref('(Run or submit to see output)')
const runStatus = ref<'passed' | 'failed' | null>(null)

watch(
  () => assessment.state?.currentIndex,
  () => {
    output.value = '(Run or submit to see output)'
    runStatus.value = null
  }
)

let timeCheckId: ReturnType<typeof setInterval> | null = null
watch(
  () => !!assessment.state?.problems?.length,
  (hasAssessment) => {
    if (timeCheckId) {
      clearInterval(timeCheckId)
      timeCheckId = null
    }
    if (!hasAssessment) return
    timeCheckId = setInterval(() => {
      if (unref(assessment.timeRemaining) <= 0 && !showTimeUpDialog.value) {
        assessment.autoSaveOnTimeUp()
        showTimeUpDialog.value = true
        if (timeCheckId) {
          clearInterval(timeCheckId)
          timeCheckId = null
        }
      }
    }, 1000)
  },
  { immediate: true }
)
onUnmounted(() => {
  if (timeCheckId) clearInterval(timeCheckId)
})

function handleTimeUpClose() {
  showTimeUpDialog.value = false
  assessment.endAssessment()
}

function formatTime(minutes: number) {
  if (minutes == null || Number.isNaN(minutes) || minutes < 0) return '0:00'
  const m = Math.floor(minutes)
  const s = Math.floor(((minutes - m) * 60) % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function difficultyType(d: string) {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  return 'danger'
}

async function runCode() {
  if (!currentProblem.value) return
  runStatus.value = null
  output.value = 'Running...'
  const ans = getAnswer(currentProblem.value.slug)
  markAttempted(currentProblem.value.slug, ans.language)
  try {
    const result = await runUserCode(
      ans.code,
      ans.language,
      currentProblem.value.sampleInput ?? '',
      currentProblem.value.slug
    )
    runStatus.value = result.success ? 'passed' : 'failed'
    output.value = result.output
  } catch (err) {
    runStatus.value = 'failed'
    output.value = `Error: ${err instanceof Error ? err.message : String(err)}`
  }
}

function submitCode() {
  if (!currentProblem.value) return
  runStatus.value = null
  output.value = 'Submitting...'
  const ans = getAnswer(currentProblem.value.slug)
  markSolved(currentProblem.value.slug, ans.language, { difficulty: currentProblem.value.difficulty })
  setTimeout(() => {
    output.value = `✓ All test cases passed (mock)`
    runStatus.value = 'passed'
  }, 500)
}
</script>
