<template>
  <div class="w-full max-w-md">
    <AppCard class="p-8">
      <h1 class="text-2xl font-bold text-app mb-2">Create account</h1>
      <p class="text-app-muted text-sm mb-6">Join AutoForge to practice DSA and ace interviews</p>

      <AppForm label-position="top" label-width="auto" @submit.prevent="handleRegister">
        <AppFormItem label="Full name" required>
          <AppInput
            v-model="name"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
            required
            class="w-full"
          />
        </AppFormItem>
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
            placeholder="Min 8 characters"
            autocomplete="new-password"
            required
            show-password
            class="w-full"
          />
        </AppFormItem>
        <AppFormItem label="Role">
          <AppSelect v-model="role" placeholder="Select role" class="w-full">
            <AppOption value="student" label="Student" />
            <AppOption value="recruiter" label="Recruiter" />
            <AppOption value="candidate" label="Candidate" />
          </AppSelect>
        </AppFormItem>
        <AppFormItem :label="''">
          <AppBtn
            type="submit"
            variant="primary"
            block
            :loading="loading"
          >
            {{ loading ? 'Creating account...' : 'Sign up' }}
          </AppBtn>
        </AppFormItem>
      </AppForm>

      <p class="mt-6 text-center text-sm text-app-muted">
        Already have an account?
        <NuxtLink to="/login" class="text-[var(--app-accent)] font-medium hover:underline">Sign in</NuxtLink>
      </p>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ auth: false })
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
