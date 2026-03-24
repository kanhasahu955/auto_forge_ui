<template>
  <div class="w-full max-w-md">
    <AppCard class="p-8">
      <h1 class="text-2xl font-bold text-app mb-2">Sign in</h1>
      <p class="text-app-muted text-sm mb-6">Enter your credentials to access AutoForge</p>

      <AppForm label-position="top" label-width="auto" @submit.prevent="handleLogin">
        <AppFormItem label="Email" required>
          <AppInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
            class="w-full"
          />
        </AppFormItem>
        <AppFormItem label="Password" required>
          <AppInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            show-password
            class="w-full"
          />
        </AppFormItem>
        <AppFormItem :label="''">
          <AppBtn
            type="submit"
            variant="primary"
            block
            :loading="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </AppBtn>
        </AppFormItem>
      </AppForm>

      <p class="mt-6 text-center text-sm text-app-muted">
        Don't have an account?
        <NuxtLink to="/register" class="text-[var(--app-accent)] font-medium hover:underline">Sign up</NuxtLink>
      </p>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ auth: false })
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
