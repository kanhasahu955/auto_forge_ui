<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto min-h-[70vh]">
    <div v-if="!resume" class="text-center py-16">
      <p class="text-app-muted mb-4">Resume not found</p>
      <NuxtLink to="/resume" class="text-[var(--app-accent)] font-medium">Back to Resume Builder</NuxtLink>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Editor panel -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/resume"
              class="p-2 rounded-lg hover:bg-[var(--app-surface-elevated)] transition"
              aria-label="Back"
            >
              <ArrowLeft class="w-5 h-5 text-app" />
            </NuxtLink>
            <input
              v-model="resume.name"
              type="text"
              class="text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-[var(--app-border)] focus:border-[var(--app-accent)] outline-none px-1 -ml-1 text-app"
              @blur="save"
            />
          </div>
          <div class="flex items-center gap-2">
            <AppBtn variant="ghost" size="small" @click="printResume">
              <Printer class="w-4 h-4 mr-2" />
              Print / Export
            </AppBtn>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Contact -->
          <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <h3 class="font-bold text-app mb-4">Contact</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-app-muted mb-1">Email</label>
                <input
                  v-model="resume.email"
                  type="email"
                  class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm"
                  placeholder="you@example.com"
                  @blur="save"
                />
              </div>
              <div>
                <label class="block text-sm text-app-muted mb-1">Phone</label>
                <input
                  v-model="resume.phone"
                  type="tel"
                  class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm"
                  placeholder="+1 234 567 8900"
                  @blur="save"
                />
              </div>
              <div>
                <label class="block text-sm text-app-muted mb-1">LinkedIn</label>
                <input
                  v-model="resume.linkedin"
                  type="url"
                  class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm"
                  placeholder="https://linkedin.com/in/username"
                  @blur="save"
                />
              </div>
              <div>
                <label class="block text-sm text-app-muted mb-1">GitHub</label>
                <input
                  v-model="resume.github"
                  type="url"
                  class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm"
                  placeholder="https://github.com/username"
                  @blur="save"
                />
              </div>
            </div>
          </div>

          <!-- Sections -->
          <div
            v-for="section in resume.sections"
            :key="section.id"
            class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6"
          >
            <h3 class="font-bold text-app mb-4">{{ section.title }}</h3>

            <div v-if="section.type === 'summary'" class="space-y-2">
              <textarea
                v-model="section.content"
                rows="4"
                class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm resize-y"
                placeholder="Brief professional summary..."
                @blur="save"
              />
            </div>

            <div v-else-if="section.type === 'skills'" class="space-y-2">
              <textarea
                v-model="section.content"
                rows="2"
                class="w-full px-3 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm resize-y"
                placeholder="e.g. JavaScript, React, Python, AWS..."
                @blur="save"
              />
            </div>

            <div v-else-if="['experience', 'education', 'projects'].includes(section.type)" class="space-y-4">
              <div
                v-for="item in (section.items || [])"
                :key="item.id"
                class="p-4 rounded-xl bg-[var(--app-bg)] space-y-2"
              >
                <div class="flex justify-between gap-2">
                  <input
                    v-model="item.title"
                    type="text"
                    class="flex-1 font-medium bg-transparent border-b border-transparent hover:border-[var(--app-border)] focus:border-[var(--app-accent)] outline-none px-0 text-app"
                    placeholder="Title"
                    @blur="save"
                  />
                  <button
                    type="button"
                    class="p-1 text-red-500 hover:bg-red-500/10 rounded"
                    @click="removeItem(section.id, item.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <input
                  v-model="item.subtitle"
                  type="text"
                  class="w-full text-sm text-app-muted bg-transparent border-none outline-none"
                  :placeholder="section.type === 'education' ? 'School, Degree' : 'Company, Location'"
                  @blur="save"
                />
                <input
                  v-if="section.type === 'experience'"
                  v-model="item.dates"
                  type="text"
                  class="w-full text-xs text-app-muted bg-transparent"
                  placeholder="Jan 2020 - Present"
                  @blur="save"
                />
                <textarea
                  v-model="item.description"
                  rows="2"
                  class="w-full text-sm bg-transparent border border-transparent hover:border-[var(--app-border)] rounded px-2 py-1 resize-y"
                  placeholder="Description..."
                  @blur="save"
                />
              </div>
              <AppBtn variant="ghost" size="small" @click="addItem(section)">
                <Plus class="w-4 h-4 mr-2" />
                Add {{ section.title.slice(0, -1) }}
              </AppBtn>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="lg:w-[380px] shrink-0">
        <div class="sticky top-24 rounded-2xl border border-[var(--app-border)] bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
          <div ref="previewRef" class="p-6 text-sm resume-preview">
            <div class="text-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">{{ resume.name }}</h1>
              <div class="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mt-1">
                <span v-if="resume.email">{{ resume.email }}</span>
                <span v-if="resume.phone">{{ resume.phone }}</span>
                <span v-if="resume.linkedin">LinkedIn</span>
                <span v-if="resume.github">GitHub</span>
              </div>
            </div>
            <div v-for="section in resume.sections" :key="section.id" class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ section.title }}</h2>
              <p v-if="section.content" class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{{ section.content }}</p>
              <div v-for="item in (section.items || [])" :key="item.id" class="mb-3">
                <div class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                <div class="text-xs text-slate-600 dark:text-slate-400">{{ item.subtitle }} <span v-if="item.dates">· {{ item.dates }}</span></div>
                <p v-if="item.description" class="text-slate-700 dark:text-slate-300 mt-1">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Printer, Plus, Trash2 } from 'lucide-vue-next'
import type { Resume, ResumeSection, ResumeItem } from '~/composables/useResume'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { getResume, updateResume, addSectionItem, removeSectionItem } = useResume()

const resume = ref<Resume | null>(null)
const previewRef = ref<HTMLElement | null>(null)

function load() {
  resume.value = getResume(id.value) ?? null
}

function save() {
  if (resume.value) updateResume(resume.value.id, resume.value)
}

function addItem(section: ResumeSection) {
  if (!resume.value) return
  addSectionItem(resume.value.id, section.id, {
    title: '',
    subtitle: '',
    description: '',
    dates: section.type === 'experience' ? '' : undefined,
  })
  load()
}

function removeItem(sectionId: string, itemId: string) {
  if (!resume.value) return
  removeSectionItem(resume.value.id, sectionId, itemId)
  load()
}

function printResume() {
  if (!previewRef.value) return
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resume.value?.name || 'Resume'}</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; max-width: 700px; margin: 0 auto; color: #1e293b; }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 1rem 0 0.5rem; }
        .meta { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
        p { margin: 0.25rem 0; font-size: 0.9rem; }
        .item { margin-bottom: 0.75rem; }
      </style>
    </head>
    <body>
      ${previewRef.value.innerHTML}
    </body>
    </html>
  `)
  win.document.close()
  win.print()
  win.close()
}

watch(id, load, { immediate: true })
</script>
