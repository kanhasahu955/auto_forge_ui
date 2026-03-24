<template>
  <div class="app-root min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />
    <header
      v-if="showHeader"
      class="app-header fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-colors duration-300"
      :class="headerClass"
    >
      <div class="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto w-full gap-4">
        <slot name="brand">
          <NuxtLink
            v-if="brandTo"
            :to="brandTo"
            class="flex items-center gap-2.5 font-bold text-lg tracking-tight transition-all shrink-0 header-brand"
          >
            <span
              v-if="brandIcon"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--app-accent)]/15 text-[var(--app-accent)]"
            >
              <component :is="brandIcon" class="w-5 h-5" />
            </span>
            <span v-if="brandName" class="hidden sm:inline">{{ brandName }}</span>
          </NuxtLink>
        </slot>
        <nav class="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <slot name="nav" />
          <slot name="auth" />
          <slot name="actions">
            <AppThemeToggle v-if="showTheme" />
          </slot>
        </nav>
      </div>
    </header>
    <div
      v-if="showOverlay"
      class="fixed inset-0 z-40"
      @click="$emit('overlay-click')"
    />
    <main class="app-main flex-1 min-h-0 overflow-auto pt-16" :class="{ 'pt-0': !showHeader }">
      <slot name="main">
        <NuxtLayout>
          <NuxtPage :page-key="route => route.fullPath" />
        </NuxtLayout>
      </slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

type Props = {
  /** Show the header bar */
  showHeader?: boolean
  /** Brand link (NuxtLink to) */
  brandTo?: string
  /** Brand display name */
  brandName?: string
  /** Brand icon component (e.g. Sparkles, Code2) */
  brandIcon?: Component
  /** Show theme toggle in actions slot */
  showTheme?: boolean
  /** Extra header classes */
  headerClass?: string
  /** Show overlay (e.g. for dropdown backdrop) - use with @overlay-click */
  showOverlay?: boolean
}

withDefaults(
  defineProps<Props>(),
  {
    showHeader: true,
    showTheme: true,
    headerClass: '',
    showOverlay: false,
  },
)

defineEmits<{
  'overlay-click': []
}>()

</script>
