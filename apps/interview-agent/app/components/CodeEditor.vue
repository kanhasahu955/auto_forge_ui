<template>
  <div class="code-editor-wrapper flex flex-col h-full min-h-0 rounded-xl overflow-hidden border border-[var(--app-border)] bg-[var(--app-surface)]">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)] shrink-0">
      <div class="flex items-center gap-3">
        <select
          :value="language"
          class="code-editor-lang-select px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--app-surface)] text-app border border-[var(--app-border)] cursor-pointer hover:border-[var(--app-accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/30 min-w-[7rem]"
          @change="$emit('update:language', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="lang in languages" :key="lang" :value="lang">
            {{ languageDisplayName(lang) }}
          </option>
        </select>
        <span class="text-[var(--app-border)]">|</span>
        <span class="text-xs text-app-muted">{{ lineCount }} lines</span>
      </div>
      <button
        type="button"
        class="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--app-accent)]/15 hover:text-[var(--app-accent)] text-app-muted"
        title="Format document (Shift+Alt+F)"
        @click="formatCode"
      >
        Format
      </button>
    </div>
    <!-- Monaco Editor -->
    <div class="code-editor-container flex-1 min-h-[280px] overflow-hidden">
      <ClientOnly fallback-tag="div" fallback="Loading editor...">
        <MonacoEditor
          ref="editorRef"
          :model-value="modelValue"
          :lang="monacoLang"
          :options="editorOptions"
          class="code-editor-monaco w-full"
          :style="{ minHeight: '260px', height: '100%' }"
          @update:model-value="$emit('update:modelValue', $event)"
          @load="onEditorLoad"
        >
          <div class="flex items-center justify-center h-full min-h-[200px] text-app-muted text-sm">Loading editor...</div>
        </MonacoEditor>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    language?: string
    languages?: string[]
    placeholder?: string
  }>(),
  {
    language: 'python',
    languages: () => ['go', 'javascript', 'python', 'typescript'],
  }
)

defineEmits<{ 'update:modelValue': [value: string]; 'update:language': [value: string] }>()

const editorRef = ref<{ $editor?: import('monaco-editor').editor.IStandaloneCodeEditor } | null>(null)
const { isDark } = useTheme()

const monacoLang = computed(() => {
  const lang = (props.language || 'python').toLowerCase()
  if (lang === 'go') return 'go'
  if (lang === 'javascript') return 'javascript'
  if (lang === 'typescript') return 'typescript'
  return 'python'
})

const lineCount = computed(() => (props.modelValue?.split('\n').length || 1))

function languageDisplayName(lang: string) {
  const map: Record<string, string> = { go: 'Go', javascript: 'JavaScript', python: 'Python', typescript: 'TypeScript' }
  return map[lang.toLowerCase()] ?? lang.charAt(0).toUpperCase() + lang.slice(1)
}

const editorOptions = computed(() => ({
  theme: isDark.value ? 'vs-dark' : 'vs',
  fontSize: 15,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', monospace",
  lineNumbers: 'on' as const,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },
  formatOnPaste: true,
  formatOnType: true,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: 'off' as const,
  automaticLayout: true,
  folding: true,
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    indentation: true,
  },
  renderLineHighlight: 'line' as const,
  cursorBlinking: 'smooth' as const,
  smoothScrolling: true,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
}))

function onEditorLoad(editor: import('monaco-editor').editor.IStandaloneCodeEditor) {
  editor.updateOptions({ tabSize: 4 })
}

function formatCode() {
  const editor = editorRef.value?.$editor
  if (!editor) return
  editor.getAction('editor.action.formatDocument')?.run()
}
</script>

<style scoped>
.code-editor-wrapper {
  --monaco-bg: var(--app-surface);
}
:deep(.code-editor-monaco) {
  min-height: 200px !important;
}
:deep(.monaco-editor) {
  padding-top: 8px !important;
}
:deep(.monaco-editor .margin) {
  background: var(--app-surface) !important;
}
</style>
