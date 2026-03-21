<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-7xl mx-auto min-h-[80vh]">
    <!-- Hero -->
    <div class="hero-section overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] relative mb-12">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />
      <div class="relative p-8 sm:p-10 lg:p-14">
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--app-accent)]/15 text-[var(--app-accent)] w-fit mb-6">
          <Sparkles class="w-4 h-4" />
          Your career acceleration platform
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-app mb-6 leading-[1.1] tracking-tight">
          Practice. Interview. Land.
          <span class="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
            All in one place
          </span>
        </h1>
        <p class="text-app-muted text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Master DSA problems, ace technical interviews, and build a standout resume. AutoForge equips you with everything to crack your dream role.
        </p>
      </div>
    </div>

    <!-- Service cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <NuxtLink
        to="/dsa"
        class="service-card group block p-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-accent)] shadow-sm"
      >
        <span class="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
          <Code2 class="w-8 h-8" />
        </span>
        <h2 class="text-xl font-bold text-app mb-3">DSA Practice</h2>
        <p class="text-app-muted text-sm sm:text-base leading-relaxed mb-4">
          LeetCode-style problems with live coding, run code in browser, and track progress. Level-based unlocks and timed assessments.
        </p>
        <span class="inline-flex items-center gap-2 text-[var(--app-accent)] font-medium text-sm">
          Start practicing
          <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </NuxtLink>

      <NuxtLink
        to="/interview"
        class="service-card group block p-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-accent)] shadow-sm"
      >
        <span class="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
          <Mic class="w-8 h-8" />
        </span>
        <h2 class="text-xl font-bold text-app mb-3">Technical Interview</h2>
        <p class="text-app-muted text-sm sm:text-base leading-relaxed mb-4">
          AI-powered mock interviews. Practice system design, coding rounds, and behavioral questions.
        </p>
        <span class="inline-flex items-center gap-2 text-[var(--app-accent)] font-medium text-sm">
          Coming soon
          <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </NuxtLink>

      <NuxtLink
        to="/resume"
        class="service-card group block p-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-accent)] shadow-sm"
      >
        <span class="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/15 text-blue-500 mb-6 group-hover:scale-110 transition-transform">
          <FileText class="w-8 h-8" />
        </span>
        <h2 class="text-xl font-bold text-app mb-3">Resume Builder</h2>
        <p class="text-app-muted text-sm sm:text-base leading-relaxed mb-4">
          Create ATS-friendly resumes with smart templates. Highlight your projects and achievements effectively.
        </p>
        <span class="inline-flex items-center gap-2 text-[var(--app-accent)] font-medium text-sm">
          Coming soon
          <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </NuxtLink>
    </div>

    <!-- Quick stats / CTA -->
    <div class="mt-14 p-8 rounded-2xl border border-[var(--app-border)] bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 text-center">
      <p class="text-app-muted text-sm sm:text-base mb-4">Get started in seconds. No sign-up required for DSA practice.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <NuxtLink to="/dsa" class="hero-btn hero-btn--primary">
          <Play class="w-5 h-5 shrink-0" />
          Browse DSA Problems
        </NuxtLink>
        <NuxtLink to="/dsa/assessment" class="hero-btn hero-btn--secondary">
          <Timer class="w-5 h-5 shrink-0" />
          Timed Assessment
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Code2, Mic, FileText, ChevronRight, Play, Timer } from 'lucide-vue-next'
</script>
