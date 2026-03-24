<template>
  <div class="org-page max-w-6xl mx-auto">
    <!-- Hero - minimal and clean -->
    <div class="mb-10">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl sm:text-3xl font-semibold text-[var(--app-text)] tracking-tight">Organizations</h1>
            <AppTag v-if="polling" type="success" effect="plain" size="small">Live</AppTag>
          </div>
          <p class="text-[var(--app-text-muted)] text-sm max-w-md">
            Create and manage teams, invite members, and run assessments.
          </p>
        </div>
        <AppBtn variant="primary" @click="showCreate = true">
          New organization
        </AppBtn>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin mb-4" />
      <p class="text-sm text-[var(--app-text-muted)]">Loading...</p>
    </div>
    <AppAlert v-else-if="error" type="error" :title="error" show-icon class="mb-6" />
    <div v-else-if="!orgs.length" class="py-16 px-6 text-center">
      <div class="org-empty-icon">📂</div>
      <h3 class="text-base font-medium text-[var(--app-text)] mb-1">No organizations yet</h3>
      <p class="text-sm text-[var(--app-text-muted)] mb-6 max-w-sm mx-auto">
        Create your first organization to start building teams and running assessments.
      </p>
      <AppBtn variant="primary" @click="showCreate = true">Create organization</AppBtn>
    </div>
    <div v-else>
      <p class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-4">
        {{ orgs.length }} organization{{ orgs.length !== 1 ? 's' : '' }}
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="org in orgs" :key="org.id" :to="`/${org.id}`" class="block">
          <AppCard class="org-card">
            <div class="flex items-center gap-4">
              <AppAvatar :size="48" class="!bg-[var(--app-accent)]/12 !text-[var(--app-accent)] !font-semibold shrink-0">
                {{ org.name?.charAt(0)?.toUpperCase() ?? 'O' }}
              </AppAvatar>
              <div class="min-w-0 flex-1">
                <h2 class="font-semibold text-[var(--app-text)] truncate">{{ org.name }}</h2>
                <p class="text-xs text-[var(--app-text-muted)] font-mono mt-0.5 truncate">{{ org.slug }}</p>
              </div>
              <span class="text-[var(--app-accent)] text-sm shrink-0">→</span>
            </div>
          </AppCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Create modal -->
    <AppDialog
      v-model="showCreate"
      title="Create organization"
      width="420px"
      :close-on-click-modal="true"
    >
      <AppForm label-position="top" @submit.prevent="handleCreate">
        <AppFormItem label="Organization name" required>
          <AppInput v-model="createName" placeholder="Acme Corp" />
        </AppFormItem>
        <AppFormItem label="URL slug" required>
          <AppInput v-model="createSlug" placeholder="acme-corp" />
        </AppFormItem>
        <AppAlert v-if="createError" type="error" :title="createError" show-icon class="mb-4" />
        <div class="flex gap-3 pt-2">
          <AppBtn variant="secondary" block @click="showCreate = false">Cancel</AppBtn>
          <AppBtn variant="primary" block :loading="createLoading" native-type="submit">Create</AppBtn>
        </div>
      </AppForm>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useOrganizationApi } from '#base/composables/useOrganizationApi'
import type { Organization } from '#base/composables/useOrganizationApi'

definePageMeta({ layout: 'default', middleware: 'auth' })

const orgApi = useOrganizationApi()
const orgs = ref<Organization[]>([])
const loading = ref(true)
const error = ref('')
const polling = ref(false)
const showCreate = ref(false)
const createName = ref('')
const createSlug = ref('')
const createLoading = ref(false)
const createError = ref('')

watch(createName, (v) => {
  if (!createSlug.value || createSlug.value === createName.value.toLowerCase().replace(/\s+/g, '-')) {
    createSlug.value = v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
})

const POLL_INTERVAL = 5000
let pollTimer: ReturnType<typeof setInterval> | null = null

async function load() {
  error.value = ''
  try {
    const res = await orgApi.listOrgs()
    orgs.value = res?.items ?? []
  } catch (e) {
    error.value = (e as Error).message
  }
}

async function loadWithSpinner() {
  loading.value = true
  await load()
  loading.value = false
}

async function handleCreate() {
  createError.value = ''
  createLoading.value = true
  try {
    await orgApi.createOrg({ name: createName.value, slug: createSlug.value })
    showCreate.value = false
    createName.value = ''
    createSlug.value = ''
    await loadWithSpinner()
    ElMessage.success('Organization created successfully')
  } catch (e: unknown) {
    const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
    createError.value = detail ?? 'Failed to create'
    ElMessage.error(detail ?? 'Failed to create organization')
  } finally {
    createLoading.value = false
  }
}

onMounted(async () => {
  await loadWithSpinner()
  pollTimer = setInterval(load, POLL_INTERVAL)
  polling.value = true
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  polling.value = false
})
</script>
