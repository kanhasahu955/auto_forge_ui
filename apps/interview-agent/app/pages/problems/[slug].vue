<template>
  <div v-if="problem && !canAccess" class="min-h-[60vh] flex items-center justify-center p-8">
    <AppResult icon="info" title="Level locked" :sub-title="`Complete the previous level to unlock this problem.`">
      <template #extra>
        <NuxtLink to="/">
          <AppBtn variant="primary">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Problems
          </AppBtn>
        </NuxtLink>
      </template>
    </AppResult>
  </div>
  <div v-else-if="problem" class="h-[calc(100vh-4rem)] flex flex-col">
    <!-- Status bar + Timer -->
    <div class="problem-status-bar px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1 min-w-0">
        <ProblemStatusBar
          :status="problemStatus"
          :progress="problemProgress"
          :code-coverage="codeCoverage"
          :accuracy="problemAccuracy"
          :has-answer="!!(problem && isSolved(problem.slug))"
        />
      </div>
      <div class="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm">
        <Timer class="w-4 h-4 text-[var(--app-accent)]" />
        <span class="font-mono text-sm font-semibold tabular-nums text-app">
          {{ elapsedTimeFormatted }}
        </span>
      </div>
    </div>
    <!-- Top bar -->
    <div class="problem-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[var(--app-border)] bg-gradient-to-r from-[var(--app-surface)] to-[var(--app-surface-elevated)] shrink-0">
      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 text-app-muted hover:text-[var(--app-accent)] text-sm font-medium transition-all hover:gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </NuxtLink>
        <span class="text-[var(--app-border)] hidden sm:inline">|</span>
        <h2 class="font-semibold text-app text-base sm:text-lg truncate">{{ problem.title }}</h2>
        <AppTag :type="difficultyType(problem.difficulty)" size="small">
          {{ problem.difficulty }}
        </AppTag>
        <span class="text-xs text-app-muted hidden sm:inline">{{ problem.acceptanceRate }}% accepted</span>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in problem.tags"
            :key="tag"
            class="px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--app-accent)]/10 text-[var(--app-accent)]"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span class="text-xs text-app-muted hidden md:inline">Ctrl+↵ Run · Ctrl+Shift+↵ Submit</span>
        <div class="flex gap-2">
          <AppBtn variant="secondary" size="small" :disabled="isRunning || isSubmitting" @click="resetToTemplate">
            <RotateCcw class="w-3.5 h-3.5 mr-1" />
            Reset
          </AppBtn>
          <AppBtn variant="success" size="small" :loading="isRunning" @click="runCode">
            <Play class="w-3.5 h-3.5 mr-1" />
            Run
          </AppBtn>
          <AppBtn variant="primary" size="small" :loading="isSubmitting" @click="submitCode">
            <Send class="w-3.5 h-3.5 mr-1" />
            Submit
          </AppBtn>
        </div>
      </div>
    </div>

    <!-- Split view: Sidebar (if assignment) + Problem + Editor -->
    <div class="flex-1 flex min-h-0">
      <!-- Assignment sidebar (iMocha/CodeSignal style) -->
      <aside
        v-if="assignmentProblems.length > 0"
        class="w-52 sm:w-64 border-r border-[var(--app-border)] bg-[var(--app-surface-elevated)] overflow-y-auto shrink-0"
      >
        <div class="p-3 border-b border-[var(--app-border)]">
          <span class="text-xs font-semibold text-app-muted uppercase tracking-wider">Assignment</span>
          <p class="text-xs text-app-muted mt-0.5">iMocha / CodeSignal</p>
        </div>
        <div class="divide-y divide-[var(--app-border)]">
          <NuxtLink
            v-for="(p, i) in assignmentProblems"
            :key="p.slug"
            :to="`/problems/${p.slug}`"
            class="block px-3 py-2.5 text-sm transition-colors"
            :class="p.slug === problem?.slug
              ? 'bg-[var(--app-accent)]/15 text-[var(--app-accent)] font-medium border-l-2 border-l-[var(--app-accent)]'
              : 'text-app-muted hover:bg-[var(--app-surface)] hover:text-app'"
          >
            <span class="font-mono text-app-muted mr-2">{{ i + 1 }}.</span>
            {{ p.title }}
          </NuxtLink>
        </div>
      </aside>

      <!-- Problem panel + Resizer + Editor (resizable) -->
      <div ref="splitContainerRef" class="flex-1 flex flex-col lg:flex-row min-h-0">
      <div
        class="border-b lg:border-b-0 lg:border-r border-[var(--app-border)] overflow-auto bg-[var(--app-surface-elevated)] shrink-0"
        :style="problemPanelStyle"
      >
        <div class="p-4 sm:p-6">
          <AppTabs v-model="activeTab" type="border-card" class="problem-tabs">
            <AppTabPane label="Description" name="description">
              <div class="space-y-6 py-2 problem-description">
                <section class="problem-section">
                  <h3 class="problem-section-title">Description</h3>
                  <div class="text-app whitespace-pre-wrap text-sm leading-relaxed">
                    {{ problem.description }}
                  </div>
                </section>
                <section class="problem-section">
                  <h3 class="problem-section-title">Constraints</h3>
                  <ul class="list-disc list-inside text-app-muted text-sm space-y-1.5">
                    <li v-for="(c, i) in problem.constraints" :key="i">{{ c }}</li>
                  </ul>
                </section>
                <section class="problem-section">
                  <h3 class="problem-section-title">Sample Input</h3>
                  <pre class="problem-code-block">{{ problem.sampleInput }}</pre>
                </section>
                <section class="problem-section">
                  <h3 class="problem-section-title">Sample Output</h3>
                  <pre class="problem-code-block">{{ problem.sampleOutput }}</pre>
                </section>
              </div>
            </AppTabPane>
            <AppTabPane label="Editorial" name="editorial">
              <div class="py-8 text-app-muted text-sm text-center">
                Editorial coming soon. Connect backend for hints & solutions.
              </div>
            </AppTabPane>
            <AppTabPane label="Submissions" name="submissions">
              <div class="py-8 text-app-muted text-sm text-center">
                Your submission history will appear here.
              </div>
            </AppTabPane>
          </AppTabs>
        </div>
      </div>

      <!-- Resizer handle (drag to resize) -->
      <div
        v-if="isLg"
        class="split-resizer w-2 flex-shrink-0 cursor-col-resize flex items-center justify-center hover:bg-[var(--app-accent)]/10 transition-colors"
        @mousedown="startResize"
      >
        <div class="w-0.5 h-12 rounded-full bg-[var(--app-border)]" aria-hidden="true" />
      </div>

      <!-- Editor + Output panel -->
      <div class="flex flex-col min-h-0 flex-1 min-w-0 lg:min-w-[400px]">
        <CodeEditor
          v-model="code"
          v-model:language="language"
          :languages="languages"
          class="flex-1 min-h-[320px] lg:min-h-0"
        />
        <div class="problem-console border-t border-[var(--app-border)] bg-[var(--app-surface-elevated)] divide-y divide-[var(--app-border)] shrink-0">
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider">Custom Test Case</h3>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-app-muted hover:text-[var(--app-accent)] hover:bg-[var(--app-accent)]/10 transition-colors"
                @click="copySampleInput"
              >
                <Copy class="w-3.5 h-3.5" />
                Use sample
              </button>
            </div>
            <textarea
              v-model="customInput"
              placeholder="e.g. [2,7,11,15]&#10;9"
              class="custom-input w-full h-24 p-4 rounded-xl bg-[var(--app-surface)] text-[var(--app-accent)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/30 border border-[var(--app-border)]"
              spellcheck="false"
            />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold text-app-muted uppercase tracking-wider">Output</h3>
              <div class="flex items-center gap-2">
                <span
                  v-if="runStatus"
                  class="text-xs font-medium px-2 py-0.5 rounded"
                  :class="runStatus === 'passed' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'"
                >
                  {{ runStatus === 'passed' ? '✓ Passed' : '✗ Failed' }}
                </span>
                <button
                  v-if="output && output !== '(Run or submit to see output)'"
                  type="button"
                  class="text-xs text-app-muted hover:text-app transition-colors"
                  @click="output = ''; runStatus = null; testResults = []"
                >
                  Clear
                </button>
              </div>
            </div>
            <pre
              class="output-pre text-sm font-mono overflow-auto max-h-48 p-4 rounded-xl min-h-[5rem] transition-colors duration-300"
              :class="runStatus === 'passed' ? 'text-emerald-500' : runStatus === 'failed' ? 'text-red-500' : 'text-app-muted'"
            >{{ output || '(Run or submit to see output)' }}</pre>
            <div v-if="testResults.length" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="(t, i) in testResults"
                :key="i"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                :class="t.passed ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'"
              >
                {{ t.passed ? '✓' : '✗' }} Test {{ i + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>

  <div v-else class="min-h-[60vh] flex items-center justify-center p-8">
    <AppResult icon="warning" title="Problem not found" sub-title="The problem you're looking for doesn't exist.">
      <template #extra>
        <NuxtLink to="/">
          <AppBtn variant="primary">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Problems
          </AppBtn>
        </NuxtLink>
      </template>
    </AppResult>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Copy, Play, RotateCcw, Send, Timer } from 'lucide-vue-next'

definePageMeta({
  key: (route) => route.params.slug as string,
})

const route = useRoute()
const router = useRouter()
const { getProblemBySlug } = useProblems()
const { markSolved, markAttempted, isSolved } = useProgress()
const { run: runUserCode } = useCodeRunner()
const { canAccessProblem, allCompleted, getNextProblemInLevel, getNextProblemInOrder } = useLevels()
const assessment = useAssessment()

const assignmentProblems = computed(() => assessment.state?.value?.problems ?? [])

const SPLIT_STORAGE_KEY = 'interview-agent-problem-split'
const MIN_PROBLEM_PCT = 25
const MAX_PROBLEM_PCT = 60
const DEFAULT_PROBLEM_PCT = 38

const problemPanelPct = ref(DEFAULT_PROBLEM_PCT)
const splitContainerRef = ref<HTMLDivElement | null>(null)
const isLg = ref(true)

function initResize() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(SPLIT_STORAGE_KEY)
  if (stored) {
    const n = Number(stored)
    if (n >= MIN_PROBLEM_PCT && n <= MAX_PROBLEM_PCT) problemPanelPct.value = n
  }
  const onResize = () => { isLg.value = window.innerWidth >= 1024 }
  onResize()
  window.addEventListener('resize', onResize)
  onUnmounted(() => window.removeEventListener('resize', onResize))
}
onMounted(initResize)

const problemPanelStyle = computed(() => {
  if (!isLg.value) return {}
  return { width: `${problemPanelPct.value}%`, minWidth: '280px' }
})

function startResize(e: MouseEvent) {
  e.preventDefault()
  const startX = e.clientX
  const startPct = problemPanelPct.value

  function onMove(moveE: MouseEvent) {
    const container = splitContainerRef.value
    if (!container) return
    const rect = container.getBoundingClientRect()
    const delta = moveE.clientX - startX
    const deltaPct = (delta / rect.width) * 100
    let next = startPct + deltaPct
    next = Math.max(MIN_PROBLEM_PCT, Math.min(MAX_PROBLEM_PCT, next))
    problemPanelPct.value = next
    try {
      localStorage.setItem(SPLIT_STORAGE_KEY, String(Math.round(next)))
    } catch { /* ignore */ }
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const problem = computed(() => getProblemBySlug(route.params.slug as string))
const canAccess = computed(() => problem.value && canAccessProblem(problem.value.slug))

const problemStartTime = ref<number | null>(null)
watch(problem, (p) => {
  if (p) problemStartTime.value = Date.now()
}, { immediate: true })

const elapsedSeconds = ref(0)
let elapsedInterval: ReturnType<typeof setInterval> | null = null
watch(problemStartTime, (start) => {
  if (elapsedInterval) clearInterval(elapsedInterval)
  elapsedInterval = null
  if (!start) {
    elapsedSeconds.value = 0
    return
  }
  elapsedSeconds.value = Math.floor((Date.now() - start) / 1000)
  elapsedInterval = setInterval(() => {
    if (problemStartTime.value) {
      elapsedSeconds.value = Math.floor((Date.now() - problemStartTime.value) / 1000)
    }
  }, 1000)
}, { immediate: true })
onUnmounted(() => {
  if (elapsedInterval) clearInterval(elapsedInterval)
})

const elapsedTimeFormatted = computed(() => {
  const s = elapsedSeconds.value
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
})

const activeTab = ref('description')
const languages = ['go', 'javascript', 'python', 'typescript']
const language = ref('python')
const code = ref('')
const customInput = ref('')
const output = ref('(Run or submit to see output)')
const runStatus = ref<'passed' | 'failed' | null>(null)
const isRunning = ref(false)
const isSubmitting = ref(false)
const testResults = ref<{ passed: boolean; input?: string; expected?: string; actual?: string }[]>([])

const problemStatus = computed<'pass' | 'fail' | 'pending'>(() => {
  if (runStatus.value === 'passed') return 'pass'
  if (runStatus.value === 'failed') return 'fail'
  return 'pending'
})

const testsPassed = computed(() => testResults.value.filter((t) => t.passed).length)
const testsTotal = computed(() => testResults.value.length || 1)
const problemProgress = computed(() => {
  const total = testResults.value.length || 1
  if (total === 0) return 0
  return Math.round((testResults.value.filter((t) => t.passed).length / total) * 100)
})
const codeCoverage = computed(() => {
  if (!code.value.trim()) return 0
  const lines = code.value.split('\n').filter((l) => l.trim())
  return Math.min(100, Math.round((lines.length / 20) * 100))
})
const problemAccuracy = computed(() => {
  if (problem.value && isSolved(problem.value.slug)) return 100
  return problemProgress.value
})

watch(
  [problem, language],
  () => {
    if (problem.value) {
      code.value = problem.value.templateCode[language.value] ?? problem.value.templateCode.python ?? problem.value.templateCode.javascript ?? problem.value.templateCode.typescript ?? problem.value.templateCode.go ?? ''
      customInput.value = problem.value.sampleInput || ''
    }
  },
  { immediate: true }
)

function resetToTemplate() {
  if (!problem.value) return
  code.value = problem.value.templateCode[language.value] ?? problem.value.templateCode.python ?? ''
  customInput.value = problem.value.sampleInput || ''
}

function copySampleInput() {
  if (problem.value) {
    customInput.value = problem.value.sampleInput || ''
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault()
    if (e.shiftKey) submitCode()
    else runCode()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
})

function difficultyType(d: string) {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  return 'danger'
}

async function runCode() {
  if (isRunning.value || isSubmitting.value || !problem.value) return
  isRunning.value = true
  runStatus.value = null
  testResults.value = []
  output.value = 'Running...'
  markAttempted(problem.value.slug, language.value)
  const inp = customInput.value.trim() || (problem.value.sampleInput ?? '')
  const slug = problem.value.slug
  const expectedOut = problem.value.sampleOutput ?? ''
  try {
    const result = await runUserCode(code.value, language.value, inp, slug)
    if (result.success) {
      let passed = false
      try {
        const actualVal = result.result
        const expectedVal = JSON.parse(expectedOut || 'null')
        passed = JSON.stringify(actualVal) === JSON.stringify(expectedVal)
      } catch {
        const actualStr = String(result.result ?? '').trim()
        passed = actualStr === expectedOut.trim()
      }
      runStatus.value = passed ? 'passed' : 'failed'
      testResults.value = [{ passed }]
      output.value = result.output
    } else {
      runStatus.value = 'failed'
      output.value = result.output
    }
  } catch (err) {
    runStatus.value = 'failed'
    output.value = `Error: ${err instanceof Error ? err.message : String(err)}`
  }
  isRunning.value = false
}

function getNextProblem() {
  const slug = problem.value?.slug
  if (!slug) return null
  const assignment = assessment.state?.value?.problems ?? []
  if (assignment.length > 0) {
    const idx = assignment.findIndex((p) => p.slug === slug)
    if (idx >= 0 && idx < assignment.length - 1) return assignment[idx + 1]
  }
  const nextInLevel = getNextProblemInLevel(slug)
  if (nextInLevel) return nextInLevel
  return getNextProblemInOrder(slug)
}

function goToNextProblem() {
  const next = getNextProblem()
  if (next) {
    const stateVal = assessment.state?.value
    if (stateVal?.problems) {
      const idx = stateVal.problems.findIndex((p) => p.slug === next.slug)
      if (idx >= 0) stateVal.currentIndex = idx
    }
    router.replace(`/problems/${next.slug}`)
  } else if (allCompleted.value) {
    router.replace('/dashboard')
  } else {
    router.replace('/')
  }
}

function submitCode() {
  if (isRunning.value || isSubmitting.value) return
  isSubmitting.value = true
  runStatus.value = null
  testResults.value = []
  output.value = 'Submitting...'
  setTimeout(async () => {
    const sampleOut = problem.value?.sampleOutput ?? ''
    output.value = `Sample Test Cases: 1/1 passed ✓\n\nYour output: ${sampleOut}\nExpected: ${sampleOut}\n✓ All sample test cases passed (mock)`
    runStatus.value = 'passed'
    testResults.value = [{ passed: true }]
    const timeTakenMs = problemStartTime.value ? Date.now() - problemStartTime.value : undefined
    const slug = problem.value!.slug
    markSolved(slug, language.value, {
      difficulty: problem.value!.difficulty,
      timeTakenMs,
    })
    assessment.setAnswer(slug, code.value, language.value)
    isSubmitting.value = false
    await nextTick()
    if (allCompleted.value) {
      router.replace('/dashboard')
    } else {
      goToNextProblem()
    }
  }, 600)
}
</script>
