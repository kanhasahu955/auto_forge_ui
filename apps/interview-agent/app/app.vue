<template>
  <AppShell
    brand-to="/"
    brand-name="Interview Agent"
    :brand-icon="Code2"
  >
    <template #main>
      <NuxtLayout>
        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </template>
    <template #nav>
      <AppNavLink to="/" exact>Problems</AppNavLink>
      <AppNavLink to="/dashboard">Dashboard</AppNavLink>
      <AppNavLink to="/assessment">Assessment</AppNavLink>
    </template>
    <template #auth>
      <span
        v-if="user"
        class="nav-link px-4 py-2 rounded-lg text-sm font-medium text-app-muted"
      >
        {{ user.name }}
      </span>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { Code2 } from 'lucide-vue-next'

const { user } = useAuth()
</script>
