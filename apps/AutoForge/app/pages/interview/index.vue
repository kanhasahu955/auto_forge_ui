<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto min-h-[70vh]">
    <!-- Hero -->
    <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative mb-8">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-orange-500/5 blur-[80px] pointer-events-none" />
      <div class="relative grid lg:grid-cols-5 gap-6 lg:gap-8 p-5 sm:p-6 lg:p-8">
        <div class="lg:col-span-3 flex flex-col justify-center">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-500/15 text-amber-500 w-fit mb-6">
            <Mic class="w-4 h-4" />
            AI-powered mock interviews
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-app mb-5 leading-[1.1] tracking-tight">
            Ace technical interviews
            <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600">
              system design, coding, behavioral
            </span>
          </h1>
          <p class="text-app-muted text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Practice live coding rounds, system design discussions, and behavioral questions. Create or join interview rooms.
          </p>
          <div class="flex flex-wrap gap-4">
            <AppBtn variant="primary" size="default" @click="showCreateRoom = true">
              <Video class="w-5 h-5 shrink-0 mr-2" />
              Create room
            </AppBtn>
            <AppBtn variant="secondary" size="default" @click="showJoinRoom = true">
              <LogIn class="w-5 h-5 shrink-0 mr-2" />
              Join room
            </AppBtn>
          </div>
        </div>
        <div class="lg:col-span-2 flex flex-col justify-center">
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-amber-500/15">
                <Code2 class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              </span>
              <div class="text-lg font-bold text-app">Coding</div>
              <div class="text-xs sm:text-sm text-app-muted">Live coding rounds</div>
            </div>
            <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-orange-500/15">
                <Layout class="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </span>
              <div class="text-lg font-bold text-app">System Design</div>
              <div class="text-xs sm:text-sm text-app-muted">Architecture & scale</div>
            </div>
            <div class="p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80">
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-emerald-500/15">
                <MessageCircle class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              </span>
              <div class="text-lg font-bold text-app">Behavioral</div>
              <div class="text-xs sm:text-sm text-app-muted">STAR format practice</div>
            </div>
            <NuxtLink
              to="/dsa"
              class="block p-4 sm:p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80 hover:border-[var(--app-accent)] transition"
            >
              <span class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 bg-cyan-500/15">
                <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
              </span>
              <div class="text-lg font-bold text-app">DSA Prep</div>
              <div class="text-xs sm:text-sm text-app-muted">Practice problems</div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent rooms / Quick tips -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 class="text-lg font-bold text-app mb-4 flex items-center gap-2">
          <Video class="w-5 h-5 text-amber-500" />
          How it works
        </h2>
        <ul class="space-y-3 text-app-muted text-sm">
          <li class="flex items-start gap-2">
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">1</span>
            Create or join an interview room with a unique ID
          </li>
          <li class="flex items-start gap-2">
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">2</span>
            Share the room link with your interviewer or practice solo
          </li>
          <li class="flex items-start gap-2">
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">3</span>
            Use the shared editor for live coding or pair programming
          </li>
        </ul>
      </div>
      <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 class="text-lg font-bold text-app mb-4 flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-amber-500" />
          Tips for success
        </h2>
        <ul class="space-y-2 text-app-muted text-sm">
          <li>• Explain your thought process out loud</li>
          <li>• Start with brute force, then optimize</li>
          <li>• Handle edge cases and test your solution</li>
          <li>• Practice system design with time limits</li>
        </ul>
      </div>
    </div>

    <!-- Create room modal -->
    <div
      v-if="showCreateRoom"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showCreateRoom = false"
    >
      <div class="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-xl">
        <h2 class="text-xl font-bold text-app mb-6">Create interview room</h2>
        <div v-if="createLoading" class="py-8 text-center text-app-muted">Creating room...</div>
        <div v-else-if="createdRoom" class="space-y-4">
          <AppAlert type="success" :closable="false">
            Room created successfully!
          </AppAlert>
          <div>
            <label class="block text-sm font-medium text-app mb-2">Room ID</label>
            <div class="flex items-center gap-2">
              <input
                :value="createdRoom.room_id"
                type="text"
                readonly
                class="flex-1 px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] text-app font-mono text-sm"
              />
              <AppBtn variant="secondary" size="small" @click="copyRoomId">
                {{ copied ? 'Copied!' : 'Copy' }}
              </AppBtn>
            </div>
          </div>
          <NuxtLink
            :to="`/interview/room/${createdRoom.room_id}`"
            class="block w-full py-3 rounded-xl bg-[var(--app-accent)] text-white font-medium text-center hover:opacity-90"
          >
            Enter room
          </NuxtLink>
        </div>
        <form v-else @submit.prevent="handleCreateRoom">
          <p class="text-app-muted text-sm mb-6">Start a new interview session. You can share the room ID with your interviewer.</p>
          <p v-if="createError" class="text-sm text-red-500 mb-4">{{ createError }}</p>
          <div class="flex gap-3">
            <AppBtn type="button" variant="ghost" size="default" @click="showCreateRoom = false">
              Cancel
            </AppBtn>
            <AppBtn type="submit" variant="primary" size="default" :disabled="createLoading">
              Create room
            </AppBtn>
          </div>
        </form>
      </div>
    </div>

    <!-- Join room modal -->
    <div
      v-if="showJoinRoom"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showJoinRoom = false"
    >
      <div class="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-xl">
        <h2 class="text-xl font-bold text-app mb-6">Join interview room</h2>
        <form @submit.prevent="handleJoinRoom">
          <div class="mb-6">
            <label for="roomId" class="block text-sm font-medium text-app mb-2">Room ID</label>
            <input
              id="roomId"
              v-model="joinRoomId"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] text-app font-mono placeholder:text-app-muted focus:ring-2 focus:ring-[var(--app-accent)] outline-none"
              placeholder="Enter room ID from your interviewer"
            />
          </div>
          <p v-if="joinError" class="text-sm text-red-500 mb-4">{{ joinError }}</p>
          <div class="flex gap-3">
            <AppBtn type="button" variant="ghost" size="default" @click="showJoinRoom = false">
              Cancel
            </AppBtn>
            <AppBtn type="submit" variant="primary" size="default">
              Join room
            </AppBtn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic, Video, LogIn, Code2, Layout, MessageCircle, ChevronRight, Sparkles } from 'lucide-vue-next'
import type { InterviewRoom } from '~/composables/useInterviewApi'

const interviewApi = useInterviewApi()
const showCreateRoom = ref(false)
const showJoinRoom = ref(false)
const createLoading = ref(false)
const createError = ref('')
const createdRoom = ref<InterviewRoom | null>(null)
const joinRoomId = ref('')
const joinError = ref('')
const copied = ref(false)

async function handleCreateRoom() {
  createError.value = ''
  createLoading.value = true
  createdRoom.value = null
  try {
    const room = await interviewApi.createRoom()
    createdRoom.value = room
  } catch (e: unknown) {
    createError.value = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Failed to create room'
  } finally {
    createLoading.value = false
  }
}

function handleJoinRoom() {
  joinError.value = ''
  const id = joinRoomId.value.trim()
  if (!id) return
  navigateTo(`/interview/room/${id}`)
  showJoinRoom.value = false
}

function copyRoomId() {
  if (!createdRoom.value?.room_id) return
  navigator.clipboard.writeText(createdRoom.value.room_id)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

watch(showCreateRoom, (v) => {
  if (!v) {
    createdRoom.value = null
    createError.value = ''
  }
})
</script>
