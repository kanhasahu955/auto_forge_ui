<template>
  <div class="dash-page px-4 sm:px-6 py-8">
    <!-- Profile header -->
    <div class="dash-page-header mb-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div class="flex items-center gap-5">
          <AppAvatar :size="80" class="!bg-[var(--app-accent)]/15 !text-[var(--app-accent)] !font-semibold !text-2xl shrink-0">
            {{ user?.name?.charAt(0)?.toUpperCase() ?? 'U' }}
          </AppAvatar>
          <div>
            <h1 class="text-xl font-semibold text-[var(--app-text)]">{{ user?.name ?? 'User' }}</h1>
            <p class="text-sm text-[var(--app-text-muted)] mt-0.5">{{ user?.email ?? '—' }}</p>
            <AppTag v-if="user?.role" type="success" size="small" effect="plain" class="mt-2">
              {{ (user.role ?? '').replace(/_/g, ' ') }}
            </AppTag>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick access -->
    <h2 class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-4">Quick access</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
      <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to">
        <AppCard class="dash-link-card !cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[var(--app-accent)]/10 flex items-center justify-center text-lg shrink-0">
              {{ link.icon }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-[var(--app-text)] text-sm">{{ link.label }}</p>
              <p class="text-xs text-[var(--app-text-muted)] truncate">{{ link.desc }}</p>
            </div>
            <span class="text-[var(--app-accent)] text-sm shrink-0">→</span>
          </div>
        </AppCard>
      </NuxtLink>
    </div>

    <!-- Account & Actions -->
    <div class="grid gap-5 lg:grid-cols-2">
      <AppCard class="dash-section-card">
        <template #header>Account</template>
        <AppDescriptions :column="1" border size="small">
          <AppDescriptionsItem label="Email">{{ user?.email ?? '—' }}</AppDescriptionsItem>
          <AppDescriptionsItem label="Role">{{ (user?.role ?? '—').replace(/_/g, ' ') }}</AppDescriptionsItem>
        </AppDescriptions>
      </AppCard>

      <AppCard class="dash-section-card">
        <template #header>Actions</template>
        <div class="flex flex-col gap-2">
          <AppBtn variant="secondary" block @click="navigateTo('/')">Go to Home</AppBtn>
          <AppBtn variant="danger" block plain @click="handleLogout">Sign out</AppBtn>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '#base/composables/useAuth'
import { useAuthApi } from '#base/composables/useAuthApi'

definePageMeta({ layout: 'default' })

const router = useRouter()
const { user, isLoggedIn } = useAuth()
const { logout } = useAuthApi()

const quickLinks = [
  { to: '/organizations', icon: '📁', label: 'Organizations', desc: 'Manage teams & assessments' },
  { to: '/dsa', icon: '📝', label: 'DSA Practice', desc: 'Solve coding problems' },
  { to: '/practice', icon: '🔥', label: 'Practice Tracks', desc: 'Structured learning paths' },
  { to: '/interview', icon: '🎤', label: 'Interview', desc: 'Mock technical interviews' },
  { to: '/resume', icon: '📄', label: 'Resume', desc: 'Build ATS-friendly resumes' },
  { to: '/contests', icon: '🏆', label: 'Contests', desc: 'Compete & rank' },
  { to: '/leaderboard', icon: '📊', label: 'Leaderboard', desc: 'See rankings' },
  { to: '/dsa/dashboard', icon: '📈', label: 'Dashboard', desc: 'Track DSA progress' },
  { to: '/analytics', icon: '📉', label: 'Analytics', desc: 'Overview & insights' },
]

onBeforeMount(() => {
  if (!isLoggedIn.value) router.replace('/login')
})

async function handleLogout() {
  await logout()
  router.replace('/')
}
</script>
