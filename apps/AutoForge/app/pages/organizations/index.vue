<template>
  <div class="dash-page px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="dash-page-header mb-10">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1>Organizations</h1>
            <AppTag v-if="polling" type="success" effect="plain" size="small">Live</AppTag>
          </div>
          <p>Create and manage teams, invite members, and run assessments.</p>
        </div>
        <AppBtn variant="primary" @click="showCreate = true">New organization</AppBtn>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="py-20 flex flex-col items-center gap-2">
      <div class="w-9 h-9 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin" />
      <p class="text-sm text-[var(--app-text-muted)]">Loading...</p>
    </div>
    <AppAlert v-else-if="error" type="error" :title="error" show-icon class="mb-6" />
    <div v-else-if="!orgs.length" class="py-16 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--app-accent)]/10 flex items-center justify-center text-2xl">📂</div>
      <h3 class="text-base font-medium text-[var(--app-text)] mb-1">No organizations yet</h3>
      <p class="text-sm text-[var(--app-text-muted)] mb-5 max-w-sm mx-auto">
        Create your first organization to start building teams and running assessments.
      </p>
      <AppBtn variant="primary" @click="showCreate = true">Create organization</AppBtn>
    </div>
    <div v-else>
      <p class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-4">
        {{ orgs.length }} organization{{ orgs.length !== 1 ? 's' : '' }}
      </p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="org in orgs" :key="org.id" :to="`/organizations/${org.id}`">
          <AppCard class="dash-link-card">
            <div class="flex items-center gap-3">
              <AppAvatar :size="44" class="!bg-[var(--app-accent)]/12 !text-[var(--app-accent)] !font-semibold shrink-0">
                {{ org.name?.charAt(0)?.toUpperCase() ?? 'O' }}
              </AppAvatar>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-[var(--app-text)] text-sm truncate">{{ org.name }}</p>
                <p class="text-xs text-[var(--app-text-muted)] font-mono truncate">{{ org.slug }}</p>
              </div>
              <span class="text-[var(--app-accent)] text-sm shrink-0">→</span>
            </div>
          </AppCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Create modal -->
    <AppDialog v-model="showCreate" title="Create organization" width="400px" :close-on-click-modal="true">
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
import { useAuth } from '#base/composables/useAuth'
import { useOrganizationApi } from '#base/composables/useOrganizationApi'
import type { Organization } from '#base/composables/useOrganizationApi'

definePageMeta({ layout: 'default' })

const { isLoggedIn } = useAuth()
const router = useRouter()

onBeforeMount(() => {
  if (!isLoggedIn.value) router.replace('/login')
})

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
    ElMessage.success('Organization created')
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
