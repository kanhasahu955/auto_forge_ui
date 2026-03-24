<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-7xl mx-auto min-h-[80vh]">
    <div class="rounded-3xl border border-gray-200 bg-white p-10 mb-12 shadow-sm">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Practice. Interview. Land.
      </h1>
      <p class="text-gray-600 text-lg max-w-2xl mb-8">
        Master DSA problems, ace technical interviews, and build a standout resume.
      </p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <NuxtLink to="/dsa" class="block p-8 rounded-2xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all">
        <h2 class="text-xl font-bold text-gray-900 mb-3">DSA Practice</h2>
        <p class="text-gray-600 text-sm mb-4">LeetCode-style problems with live coding.</p>
        <span class="text-emerald-600 font-medium text-sm">Start practicing →</span>
      </NuxtLink>
      <NuxtLink to="/interview" class="block p-8 rounded-2xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all">
        <h2 class="text-xl font-bold text-gray-900 mb-3">Technical Interview</h2>
        <p class="text-gray-600 text-sm mb-4">AI-powered mock interviews.</p>
        <span class="text-emerald-600 font-medium text-sm">Create room →</span>
      </NuxtLink>
      <NuxtLink to="/resume" class="block p-8 rounded-2xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all">
        <h2 class="text-xl font-bold text-gray-900 mb-3">Resume Builder</h2>
        <p class="text-gray-600 text-sm mb-4">Create ATS-friendly resumes.</p>
        <span class="text-emerald-600 font-medium text-sm">Build resume →</span>
      </NuxtLink>
    </div>
    <div class="mt-14 p-8 rounded-2xl border border-gray-200 bg-gray-50 text-center">
      <p class="text-gray-600 mb-4">Get started in seconds.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <NuxtLink to="/dsa" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">Browse DSA</NuxtLink>
        <NuxtLink to="/dsa/assessment" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-emerald-500">Assessment</NuxtLink>
        <NuxtLink to="/interview" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-emerald-500">Interview</NuxtLink>
        <NuxtLink to="/contests" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-emerald-500">Contests</NuxtLink>
        <NuxtLink to="/leaderboard" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-emerald-500">Leaderboard</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Minimal - no composables or icon imports
</script>
