<template>
  <div class="app-root min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />
    <header class="flex h-14 items-center justify-between px-4 border-b border-[var(--app-border)] bg-[var(--app-header-bg)]">
      <a href="/" class="text-app hover:text-[var(--app-accent)]">← Back to AutoForge</a>
      <AppThemeToggle />
    </header>
    <main class="flex-1 flex items-center justify-center p-4">
      <NuxtPage :page-key="route => route.fullPath" />
    </main>
    <footer class="py-4 text-center text-sm text-app-muted">
      <a href="/" class="hover:text-[var(--app-accent)]">← Back to AutoForge</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Auth MFE - minimal shell
</script>
