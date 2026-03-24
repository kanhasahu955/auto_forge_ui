<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-lg">
      <h1 class="text-2xl font-bold text-[var(--app-text)] mb-2">Create account</h1>
      <p class="text-[var(--app-text-muted)] text-sm mb-6">Join AutoForge to practice DSA and ace interviews</p>

      <form class="space-y-5" @submit.prevent="handleRegister">
        <div>
          <label for="name" class="block text-sm font-medium text-[var(--app-text)] mb-2">Full name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="John Doe"
            class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-[var(--app-text)] mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-[var(--app-text)] mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            placeholder="Min 8 characters"
            class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-[var(--app-text)] mb-2">Role</label>
          <select
            id="role"
            v-model="role"
            class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent outline-none"
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
            <option value="candidate">Candidate</option>
          </select>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 rounded-xl font-semibold text-white bg-[var(--app-accent)] hover:opacity-90 disabled:opacity-50 transition"
        >
          {{ loading ? 'Creating account...' : 'Sign up' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-[var(--app-text-muted)]">
        Already have an account?
        <NuxtLink to="/login" class="text-[var(--app-accent)] font-medium hover:underline">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useAuth } from '#base/composables/useAuth'
import { useAuthApi } from '#base/composables/useAuthApi'

const router = useRouter()
const { register } = useAuthApi()
const { isLoggedIn } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const loading = ref(false)

if (isLoggedIn.value) {
  router.replace('/')
}

function getErrorMessage(e: unknown): string {
  const err = e as { response?: { status?: number; data?: { detail?: string; message?: string } } }
  const data = err?.response?.data
  return data?.message ?? data?.detail ?? (err?.response?.status === 409 ? 'Email already registered. Sign in instead?' : 'Registration failed')
}

async function handleRegister() {
  if (loading.value) return
  loading.value = true
  try {
    await register({ name: name.value, email: email.value, password: password.value, role: role.value })
    ElMessage.success('Account created! Please sign in.')
    await nextTick()
    router.replace('/login')
  } catch (e: unknown) {
    ElMessage.error({ message: getErrorMessage(e), duration: 5000 })
  } finally {
    loading.value = false
  }
}
</script>
