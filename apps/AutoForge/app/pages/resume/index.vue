<template>
  <div class="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-4xl mx-auto min-h-[70vh]">
    <div class="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 sm:p-12 text-center">
      <span class="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/15 text-blue-500 mx-auto mb-6">
        <FileText class="w-10 h-10" />
      </span>
      <h1 class="text-2xl sm:text-3xl font-bold text-app mb-4">Resume Builder</h1>
      <p class="text-app-muted text-base sm:text-lg max-w-md mx-auto mb-8">
        Create ATS-friendly resumes with smart templates. Highlight your projects, skills, and achievements effectively.
      </p>
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
        <Clock class="w-4 h-4" />
        Coming soon
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Clock } from 'lucide-vue-next'
</script>
