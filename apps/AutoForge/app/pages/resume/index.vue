<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative mb-8">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div class="relative grid lg:grid-cols-5 gap-6 lg:gap-8 p-5 sm:p-6 lg:p-8">
        <div class="lg:col-span-3 flex flex-col justify-center">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500/15 text-blue-500 w-fit mb-6">
            <FileText class="w-4 h-4" />
            ATS-friendly templates
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-app mb-5 leading-[1.1] tracking-tight">
            Build a standout resume
            <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
              land your dream role
            </span>
          </h1>
          <p class="text-app-muted text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Create professional, ATS-optimized resumes. Highlight your projects, skills, and achievements with smart templates.
          </p>
          <AppBtn variant="primary" size="default" @click="handleCreate">
            <Plus class="w-5 h-5 shrink-0 mr-2" />
            Create new resume
          </AppBtn>
        </div>
        <div class="lg:col-span-2 flex flex-col justify-center">
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-blue-500/15">
                <FileText class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </span>
              <div class="text-lg font-bold text-app">{{ resumes.length }}</div>
              <div class="text-xs sm:text-sm text-app-muted">Resumes</div>
            </div>
            <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-indigo-500/15">
                <Layout class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              </span>
              <div class="text-lg font-bold text-app">3</div>
              <div class="text-xs sm:text-sm text-app-muted">Templates</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template previews -->
    <div class="mb-8">
      <h2 class="text-lg font-bold text-app mb-4">Choose a template</h2>
      <div class="grid sm:grid-cols-3 gap-4">
        <div
          v-for="t in templates"
          :key="t.id"
          class="rounded-2xl border-2 p-4 cursor-pointer transition"
          :class="selectedTemplate === t.id ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/5' : 'border-[var(--app-border)] hover:border-[var(--app-accent)]/50'"
          @click="selectedTemplate = t.id"
        >
          <div class="aspect-[3/4] rounded-xl bg-[var(--app-surface-elevated)] mb-3 overflow-hidden">
            <div class="p-4 h-full" :class="t.previewClass">
              <div class="h-2 w-1/2 rounded bg-current opacity-30 mb-3" />
              <div class="h-2 w-2/3 rounded bg-current opacity-20 mb-2" />
              <div class="h-2 w-1/3 rounded bg-current opacity-20 mb-4" />
              <div class="h-1 w-full rounded bg-current opacity-10 mb-1" />
              <div class="h-1 w-full rounded bg-current opacity-10 mb-1" />
              <div class="h-1 w-3/4 rounded bg-current opacity-10" />
            </div>
          </div>
          <div class="font-semibold text-app">{{ t.name }}</div>
          <div class="text-xs text-app-muted">{{ t.desc }}</div>
        </div>
      </div>
    </div>

    <!-- My resumes -->
    <h2 class="text-lg font-bold text-app mb-4">My resumes</h2>
    <div v-if="resumes.length === 0" class="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
      <FileText class="w-12 h-12 text-app-muted mx-auto mb-3 opacity-50" />
      <p class="text-app-muted mb-4">No resumes yet</p>
      <AppBtn variant="primary" size="default" @click="handleCreate">
        <Plus class="w-5 h-5 mr-2" />
        Create your first resume
      </AppBtn>
    </div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="r in resumes"
        :key="r.id"
        class="group rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 hover:border-[var(--app-accent)] transition"
      >
        <div class="flex items-start justify-between gap-2 mb-3">
          <h3 class="font-semibold text-app truncate flex-1">{{ r.name }}</h3>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              class="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
              aria-label="Delete"
              @click="handleDelete(r.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        <p class="text-xs text-app-muted mb-4">
          Updated {{ formatDate(r.updatedAt) }} · {{ r.template }}
        </p>
        <NuxtLink
          :to="`/resume/${r.id}`"
          class="inline-flex items-center gap-2 text-[var(--app-accent)] font-medium text-sm hover:underline"
        >
          Edit resume
          <ChevronRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Plus, Layout, ChevronRight, Trash2 } from 'lucide-vue-next'

const { resumes, createResume, deleteResume, loadFromStorage } = useResume()

const selectedTemplate = ref<'minimal' | 'professional' | 'modern'>('professional')

const templates = [
  { id: 'minimal' as const, name: 'Minimal', desc: 'Clean, single column', previewClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: 'professional' as const, name: 'Professional', desc: 'Classic two column', previewClass: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700' },
  { id: 'modern' as const, name: 'Modern', desc: 'Bold headers', previewClass: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-200' },
]

function handleCreate() {
  const name = `Resume ${resumes.value.length + 1}`
  const resume = createResume(name)
  navigateTo(`/resume/${resume.id}`)
}

async function handleDelete(id: string) {
  if (!confirm('Delete this resume?')) return
  deleteResume(id)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

onMounted(loadFromStorage)
</script>
