<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col">
    <!-- Room header -->
    <div class="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          to="/interview"
          class="p-2 rounded-lg hover:bg-[var(--app-surface-elevated)] transition shrink-0"
          aria-label="Back to Interview"
        >
          <ArrowLeft class="w-5 h-5 text-app" />
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="font-bold text-app truncate">Interview Room</h1>
          <p class="text-xs text-app-muted font-mono truncate">{{ roomId }}</p>
        </div>
        <AppTag v-if="connected" type="success" size="small">Connected</AppTag>
        <AppTag v-else type="warning" size="small">Connecting...</AppTag>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--app-border)] text-sm hover:bg-[var(--app-surface-elevated)]"
          @click="copyLink"
        >
          {{ linkCopied ? 'Copied!' : 'Copy link' }}
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col md:flex-row min-h-0">
      <!-- Video / placeholder area -->
      <div class="md:w-1/3 border-b md:border-b-0 md:border-r border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 flex flex-col items-center justify-center">
        <div class="w-full aspect-video max-w-md rounded-xl bg-black/20 flex items-center justify-center">
          <div class="text-center text-app-muted">
            <Video class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p class="text-sm">Video / screen share</p>
            <p class="text-xs mt-1">Coming soon</p>
          </div>
        </div>
        <p class="text-xs text-app-muted mt-3">Share your screen or enable camera when ready</p>
      </div>

      <!-- Editor / chat area -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex border-b border-[var(--app-border)]">
          <button
            type="button"
            class="px-4 py-3 text-sm font-medium border-b-2 transition"
            :class="activeTab === 'editor' ? 'border-[var(--app-accent)] text-[var(--app-accent)]' : 'border-transparent text-app-muted hover:text-app'"
            @click="activeTab = 'editor'"
          >
            Code
          </button>
          <button
            type="button"
            class="px-4 py-3 text-sm font-medium border-b-2 transition"
            :class="activeTab === 'chat' ? 'border-[var(--app-accent)] text-[var(--app-accent)]' : 'border-transparent text-app-muted hover:text-app'"
            @click="activeTab = 'chat'"
          >
            Chat
          </button>
        </div>
        <div v-if="activeTab === 'editor'" class="flex-1 min-h-[300px] p-4">
          <div class="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] p-4 font-mono text-sm text-app-muted">
            <p>Shared editor will appear here. The interview room WebSocket is connected.</p>
            <p class="mt-2 text-xs">Room ID: {{ roomId }}</p>
            <NuxtLink to="/dsa" class="mt-4 inline-flex items-center gap-2 text-[var(--app-accent)] hover:underline">
              Practice coding problems
              <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
        <div v-else class="flex-1 p-4 overflow-auto">
          <div class="space-y-3">
            <div v-if="messages.length === 0" class="text-center py-8 text-app-muted text-sm">
              No messages yet. Start the conversation!
            </div>
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="p-3 rounded-lg"
              :class="msg.self ? 'bg-[var(--app-accent)]/15 ml-8' : 'bg-[var(--app-surface-elevated)] mr-8'"
            >
              <p class="text-sm text-app">{{ msg.text }}</p>
              <p class="text-xs text-app-muted mt-1">{{ msg.time }}</p>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <input
              v-model="chatInput"
              type="text"
              placeholder="Type a message..."
              class="flex-1 px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] text-app text-sm outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
              @keydown.enter="sendMessage"
            />
            <AppBtn variant="primary" size="small" @click="sendMessage">Send</AppBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Video, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const roomId = computed(() => (route.params.roomId as string) || '')

const connected = ref(false)
const activeTab = ref<'editor' | 'chat'>('editor')
const chatInput = ref('')
const messages = ref<{ text: string; time: string; self: boolean }[]>([])
const linkCopied = ref(false)

const interviewApi = useInterviewApi()

// Attempt WebSocket connection (backend returns wip for now)
let ws: WebSocket | null = null
onMounted(() => {
  const wsUrl = interviewApi.getWsUrl(roomId.value)
  try {
    ws = new WebSocket(wsUrl)
    ws.onopen = () => { connected.value = true }
    ws.onclose = () => { connected.value = false }
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'joined') {
          messages.value.push({ text: `Joined room ${data.room_id}`, time: new Date().toLocaleTimeString(), self: false })
        }
      } catch {}
    }
  } catch {
    connected.value = false
  }
})

onUnmounted(() => {
  ws?.close()
})

function copyLink() {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/interview/room/${roomId.value}` : ''
  navigator.clipboard.writeText(url)
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  messages.value.push({ text, time: new Date().toLocaleTimeString(), self: true })
  chatInput.value = ''
}
</script>
