<template>
  <div class="app-root min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />
    <header class="app-header fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-colors duration-300">
      <div class="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto w-full gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 font-bold text-lg tracking-tight transition-all shrink-0 header-brand"
        >
          <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--app-accent)]/15 text-[var(--app-accent)]">
            <Sparkles class="w-5 h-5" />
          </span>
          <span class="hidden sm:inline">AutoForge</span>
        </NuxtLink>
        <nav class="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <NuxtLink
            to="/"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
            exact-active-class="nav-link-active bg-[var(--app-accent)]/10"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/dsa"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
            active-class="nav-link-active bg-[var(--app-accent)]/10"
          >
            DSA
          </NuxtLink>
          <NuxtLink
            to="/interview"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
            active-class="nav-link-active bg-[var(--app-accent)]/10"
          >
            Interview
          </NuxtLink>
          <NuxtLink
            to="/resume"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
            active-class="nav-link-active bg-[var(--app-accent)]/10"
          >
            Resume
          </NuxtLink>
          <span
            v-if="user"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-app-muted"
          >
            {{ user.name }}
          </span>
          <button
            type="button"
            class="theme-toggle ml-2 p-2.5 rounded-xl transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDark()"
          >
            <Sun v-if="isDark" class="w-5 h-5 text-amber-500" />
            <Moon v-else class="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </nav>
      </div>
    </header>
    <main class="app-main flex-1 min-h-0 overflow-auto pt-16">
      <NuxtLayout>
        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Sun, Moon } from 'lucide-vue-next'

const { isDark, toggleDark } = useTheme()
const { user } = useAuth()
</script>
