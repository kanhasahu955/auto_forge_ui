<template>
  <div class="app-root org-mfe-root min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />
    <header class="org-header fixed top-0 left-0 right-0 z-50 h-14 border-b backdrop-blur-xl">
      <div class="flex h-full items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
        <NuxtLink to="/" class="flex items-center gap-2.5 font-semibold text-[var(--app-text)] hover:text-[var(--app-accent)] transition-colors">
          <span class="w-7 h-7 rounded-md bg-[var(--app-accent)]/15 flex items-center justify-center text-[var(--app-accent)] text-sm font-bold">O</span>
          Organizations
        </NuxtLink>
        <div class="flex items-center gap-1">
          <span v-if="user" class="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm text-[var(--app-text-muted)]">
            <span class="w-6 h-6 rounded-full bg-[var(--app-accent)]/20 flex items-center justify-center text-xs font-medium text-[var(--app-accent)]">{{ user.name?.charAt(0)?.toUpperCase() ?? 'U' }}</span>
            {{ user.name }}
          </span>
          <NuxtLink to="/" class="px-3 py-2 rounded-md text-sm text-[var(--app-text-muted)] hover:text-[var(--app-accent)] hover:bg-[var(--app-accent)]/5 transition-colors">
            Back
          </NuxtLink>
          <button type="button" class="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors" :aria-label="isDark ? 'Light' : 'Dark'" @click="toggleDark()">
            <span v-if="isDark" class="text-base">☀️</span>
            <span v-else class="text-base">🌙</span>
          </button>
        </div>
      </div>
    </header>
    <main class="flex-1 pt-14 px-4 sm:px-6 py-8 min-h-screen overflow-auto bg-[var(--org-bg,var(--app-bg))]">
      <NuxtLayout>
        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { isDark, toggleDark } = useTheme()
</script>
