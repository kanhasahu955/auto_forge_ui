<template>
  <button
    type="button"
    class="theme-toggle ml-2 p-2.5 rounded-xl transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleDark()"
  >
    <Sun v-if="isDark" class="w-5 h-5 text-amber-500" />
    <Moon v-else class="w-5 h-5 text-slate-600 dark:text-slate-400" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggleDark } = useTheme()
</script>
