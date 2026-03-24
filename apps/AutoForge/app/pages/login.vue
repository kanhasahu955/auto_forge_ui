<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-lg">
      <h1 class="text-2xl font-bold text-[var(--app-text)] mb-2">Sign in</h1>
      <p class="text-[var(--app-text-muted)] text-sm mb-6">Enter your credentials to access AutoForge</p>

      <form class="space-y-5" @submit.prevent="handleLogin">
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
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 rounded-xl font-semibold text-white bg-[var(--app-accent)] hover:opacity-90 disabled:opacity-50 transition"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-[var(--app-text-muted)]">
        Don't have an account?
        <NuxtLink to="/register" class="text-[var(--app-accent)] font-medium hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useAuth } from '#base/composables/useAuth'
import { useAuthApi } from '#base/composables/useAuthApi'

const router = useRouter()
const { login } = useAuthApi()
const { isLoggedIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)

if (isLoggedIn.value) {
  router.replace('/')
}

function getErrorMessage(e: unknown): string {
  const err = e as { response?: { data?: { detail?: string; message?: string } } }
  const data = err?.response?.data
  return data?.message ?? data?.detail ?? 'Invalid email or password'
}

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
    router.replace('/')
  } catch (e: unknown) {
    ElMessage.error({ message: getErrorMessage(e), duration: 5000 })
  } finally {
    loading.value = false
  }
}
</script>
