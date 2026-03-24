<template>
  <div class="org-detail max-w-6xl mx-auto">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin mb-4" />
      <p class="text-sm text-[var(--app-text-muted)]">Loading...</p>
    </div>
    <AppAlert v-else-if="error" type="error" :title="error" show-icon />
    <template v-else-if="org">
      <!-- Header - clean -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/" class="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-accent)] transition-colors shrink-0">
          ← Back
        </NuxtLink>
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <AppAvatar :size="56" class="!bg-[var(--app-accent)]/12 !text-[var(--app-accent)] !font-semibold shrink-0">
            {{ org.name?.charAt(0)?.toUpperCase() ?? 'O' }}
          </AppAvatar>
          <div class="min-w-0">
            <h1 class="text-xl sm:text-2xl font-semibold text-[var(--app-text)] truncate">{{ org.name }}</h1>
            <p class="text-sm text-[var(--app-text-muted)] font-mono truncate">{{ org.slug }}</p>
          </div>
          <AppTag v-if="polling" type="success" effect="plain" size="small" class="shrink-0 ml-auto">Live</AppTag>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <AppCard v-for="stat in stats" :key="stat.label" class="org-stat-card">
          <p class="text-xl font-semibold text-[var(--app-accent)]">{{ stat.value }}</p>
          <p class="text-xs text-[var(--app-text-muted)] mt-0.5">{{ stat.label }}</p>
        </AppCard>
      </div>

      <!-- Activities & Assessments -->
      <div class="grid gap-6 lg:grid-cols-2 mb-8">
        <AppCard class="org-section-card">
          <template #header>
            <span class="text-sm font-medium text-[var(--app-text)]">Activities</span>
          </template>
          <div v-if="activitiesLoading" class="py-6 flex items-center justify-center gap-2 text-sm text-[var(--app-text-muted)]">
            <div class="w-4 h-4 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
          <p v-else-if="!activities.length" class="py-6 text-sm text-[var(--app-text-muted)] text-center">No activities yet</p>
          <ul v-else class="space-y-1">
            <li
              v-for="a in activities"
              :key="a.id"
              class="org-list-item flex justify-between items-center"
            >
              <span class="font-medium text-[var(--app-text)] truncate">{{ a.name }}</span>
              <AppTag size="small" type="info" effect="plain" class="shrink-0 ml-2">{{ a.type }} · {{ a.status }}</AppTag>
            </li>
          </ul>
        </AppCard>

        <AppCard class="org-section-card">
          <template #header>
            <span class="text-sm font-medium text-[var(--app-text)]">Assessments</span>
          </template>
          <div v-if="assessmentsLoading" class="py-6 flex items-center justify-center gap-2 text-sm text-[var(--app-text-muted)]">
            <div class="w-4 h-4 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
          <p v-else-if="!assessments.length" class="py-6 text-sm text-[var(--app-text-muted)] text-center">No assessments yet</p>
          <ul v-else class="space-y-1">
            <li
              v-for="a in assessments"
              :key="a.id"
              class="org-list-item flex justify-between items-center"
            >
              <span class="font-medium text-[var(--app-text)] truncate">{{ a.name }}</span>
              <AppTag size="small" type="info" effect="plain" class="shrink-0 ml-2">{{ a.duration_minutes }} min · {{ a.status }}</AppTag>
            </li>
          </ul>
        </AppCard>
      </div>

      <!-- Members -->
      <AppCard class="org-section-card">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-[var(--app-text)]">Team members</span>
            <AppBtn variant="primary" size="small" @click="showInvite = true">Invite</AppBtn>
          </div>
        </template>
        <div v-if="membersLoading" class="py-6 flex items-center justify-center gap-2 text-sm text-[var(--app-text-muted)]">
          <div class="w-4 h-4 border-2 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
        <div v-else-if="!members.length && !invitations.length" class="py-8 text-center">
          <p class="text-sm text-[var(--app-text-muted)] mb-4">No members yet</p>
          <AppBtn variant="secondary" size="small" @click="showInvite = true">Invite your first member</AppBtn>
        </div>
        <div v-else class="space-y-5">
          <div v-if="members.length">
            <p class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-2">Members</p>
            <div class="space-y-1">
              <div
                v-for="m in members"
                :key="m.id"
                class="org-list-item flex items-center gap-3"
              >
                <AppAvatar :size="32" class="!bg-[var(--app-accent)]/12 !text-[var(--app-accent)] !text-sm shrink-0">
                  {{ (m.user_id ?? m.invited_email ?? '?')?.charAt(0)?.toUpperCase() ?? '—' }}
                </AppAvatar>
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-[var(--app-text)] text-sm truncate">{{ m.user_id ?? m.invited_email ?? '—' }}</span>
                  <span class="text-xs text-[var(--app-text-muted)] ml-1">{{ m.role }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="invitations.length">
            <p class="text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider mb-2">Pending</p>
            <div class="space-y-1">
              <div
                v-for="inv in invitations"
                :key="inv.id"
                class="org-list-item flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
              >
                <AppAvatar :size="32" class="!bg-amber-500/15 !text-amber-600 shrink-0">✉</AppAvatar>
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-[var(--app-text)] text-sm truncate">{{ inv.email }}</span>
                  <AppTag size="small" type="warning" effect="plain" class="ml-1">{{ inv.status }}</AppTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </template>

    <!-- Invite modal -->
    <AppDialog v-model="showInvite" title="Invite team member" width="400px">
      <AppForm v-if="org" label-position="top" @submit.prevent="handleInvite">
        <AppFormItem label="Email address" required>
          <AppInput v-model="inviteEmail" type="email" placeholder="member@example.com" />
        </AppFormItem>
        <AppFormItem label="Role">
          <AppSelect v-model="inviteRole" placeholder="Select role" class="w-full">
            <el-option value="RECRUITER" label="Recruiter" />
            <el-option value="ADMIN" label="Admin" />
            <el-option value="INTERVIEWER" label="Interviewer" />
            <el-option value="OWNER" label="Owner" />
          </AppSelect>
        </AppFormItem>
        <AppAlert v-if="inviteError" type="error" :title="inviteError" show-icon class="mb-4" />
        <div class="flex gap-3">
          <AppBtn variant="secondary" block @click="showInvite = false">Cancel</AppBtn>
          <AppBtn variant="primary" block :loading="inviteLoading" native-type="submit">Send invitation</AppBtn>
        </div>
      </AppForm>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useOrganizationApi } from '#base/composables/useOrganizationApi'
import type { Activity, Assessment, OrgMember } from '#base/composables/useOrganizationApi'

interface Invitation {
  id: number
  email: string
  status: string
}

definePageMeta({ layout: 'default', middleware: 'auth' })

const route = useRoute()
const orgId = computed(() => route.params.id as string)
const orgApi = useOrganizationApi()

const org = ref<{ id: string; name: string; slug: string } | null>(null)
const loading = ref(true)
const error = ref('')
const activities = ref<Activity[]>([])
const assessments = ref<Assessment[]>([])
const members = ref<OrgMember[]>([])
const invitations = ref<Invitation[]>([])
const activitiesLoading = ref(false)
const assessmentsLoading = ref(false)
const membersLoading = ref(false)
const showInvite = ref(false)
const polling = ref(false)

const inviteEmail = ref('')
const inviteRole = ref('RECRUITER')
const inviteLoading = ref(false)
const inviteError = ref('')

const stats = computed(() => [
  { label: 'Activities', value: activities.value.length },
  { label: 'Assessments', value: assessments.value.length },
  { label: 'Members', value: members.value.length },
  { label: 'Pending invites', value: invitations.value.length },
])

const POLL_INTERVAL = 5000
let pollTimer: ReturnType<typeof setInterval> | null = null

async function loadOrg() {
  loading.value = true
  error.value = ''
  try {
    org.value = await orgApi.getOrg(orgId.value)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

async function loadActivities() {
  activitiesLoading.value = true
  try {
    const res = await orgApi.listActivities(orgId.value)
    activities.value = res?.items ?? []
  } finally {
    activitiesLoading.value = false
  }
}

async function loadAssessments() {
  assessmentsLoading.value = true
  try {
    const res = await orgApi.listAssessments(orgId.value)
    assessments.value = res?.items ?? []
  } finally {
    assessmentsLoading.value = false
  }
}

async function loadMembers() {
  membersLoading.value = true
  try {
    const res = await orgApi.listMembers(orgId.value)
    members.value = res?.items ?? []
  } finally {
    membersLoading.value = false
  }
}

async function loadInvitations() {
  try {
    const res = await orgApi.listInvitations(orgId.value, { status: 'PENDING' })
    invitations.value = (res?.items ?? []) as Invitation[]
  } catch {
    invitations.value = []
  }
}

function poll() {
  if (!org.value) return
  loadOrg()
  loadActivities()
  loadAssessments()
  loadMembers()
  loadInvitations()
}

async function handleInvite() {
  inviteError.value = ''
  inviteLoading.value = true
  try {
    const sentTo = inviteEmail.value
    await orgApi.inviteMember(orgId.value, { email: inviteEmail.value, role: inviteRole.value })
    showInvite.value = false
    inviteEmail.value = ''
    inviteRole.value = 'RECRUITER'
    await loadInvitations()
    ElMessage.success(`Invitation sent to ${sentTo}`)
  } catch (e: unknown) {
    const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
    inviteError.value = detail ?? 'Failed to send invitation'
    ElMessage.error(detail ?? 'Failed to send invitation')
  } finally {
    inviteLoading.value = false
  }
}

onMounted(async () => {
  await loadOrg()
  if (org.value) {
    loadActivities()
    loadAssessments()
    loadMembers()
    loadInvitations()
  }
  pollTimer = setInterval(poll, POLL_INTERVAL)
  polling.value = true
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  polling.value = false
})
</script>
