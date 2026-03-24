<template>
  <div class="app-root min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />
    <header class="app-header fixed top-0 left-0 right-0 z-50 h-16 border-b backdrop-blur-2xl">
      <div class="flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto w-full gap-4">
        <NuxtLink to="/" class="font-bold text-lg header-brand shrink-0">AutoForge</NuxtLink>
        <nav class="flex items-center gap-1 sm:gap-2 text-sm">
        <NuxtLink to="/" class="nav-link px-4 py-2 rounded-lg" exact-active-class="nav-link-active bg-[var(--app-accent)]/10">Home</NuxtLink>
        <NuxtLink to="/dsa" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">DSA</NuxtLink>
        <NuxtLink to="/practice" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Practice</NuxtLink>
        <NuxtLink to="/interview" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Interview</NuxtLink>
        <NuxtLink to="/resume" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Resume</NuxtLink>
        <NuxtLink to="/contests" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Contests</NuxtLink>
        <NuxtLink to="/leaderboard" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Leaderboard</NuxtLink>
        <NuxtLink to="/dsa/dashboard" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Dashboard</NuxtLink>
        <NuxtLink to="/analytics" class="nav-link px-4 py-2 rounded-lg" active-class="nav-link-active bg-[var(--app-accent)]/10">Analytics</NuxtLink>
        <a
          href="/organizations"
          class="nav-link px-4 py-2 rounded-lg cursor-pointer"
          :class="{ 'nav-link-active bg-[var(--app-accent)]/10': isOrganizationsPage }"
          @click.prevent="navigateTo('/organizations')"
        >
          Organizations
        </a>
        <NuxtLink v-if="!isLoggedIn" to="/login" class="nav-link px-4 py-2 rounded-lg">Login</NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/register" class="nav-link px-4 py-2 rounded-lg bg-[var(--app-accent)]/15 text-[var(--app-accent)] hover:bg-[var(--app-accent)]/25">Sign up</NuxtLink>
        <el-dropdown v-else trigger="click" placement="bottom-end" @command="handleUserCommand">
          <button
            type="button"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--app-accent)]/10 transition-colors"
          >
            <span class="w-8 h-8 rounded-full bg-[var(--app-accent)]/20 flex items-center justify-center text-sm font-semibold text-[var(--app-accent)]">
              {{ user?.name?.charAt(0)?.toUpperCase() ?? 'U' }}
            </span>
            <span class="nav-link text-app-muted max-w-[100px] truncate hidden sm:inline">{{ user?.name }}</span>
            <span class="text-xs text-app-muted">▼</span>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="organizations">
                <span class="flex items-center gap-2">
                  <span>📁</span>
                  My Organizations
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="profile">
                <span class="flex items-center gap-2">
                  <span>👤</span>
                  Profile
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <span class="flex items-center gap-2 text-red-500">
                  <span>🚪</span>
                  Logout
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <button
          type="button"
          class="ml-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          :aria-label="isDark ? 'Light mode' : 'Dark mode'"
          @click="toggleDark()"
        >
          <span v-if="isDark" class="text-lg">☀️</span>
          <span v-else class="text-lg">🌙</span>
        </button>
        </nav>
      </div>
    </header>
    <main class="app-main flex-1 pt-16 px-4 min-h-screen overflow-auto">
      <NuxtLayout>
        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '#base/composables/useAuth'
import { useAuthApi } from '#base/composables/useAuthApi'
import { useTheme } from '#base/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { user, isLoggedIn } = useAuth()
const { logout } = useAuthApi()
const { isDark, toggleDark } = useTheme()

const isOrganizationsPage = computed(() => route.path.startsWith('/organizations'))

function handleUserCommand(cmd: string) {
  if (cmd === 'organizations') navigateTo('/organizations')
  else if (cmd === 'profile') navigateTo('/profile')
  else if (cmd === 'logout') {
    logout()
    router.replace('/')
  }
}
</script>
