<template>
  <div class="relative mx-auto flex max-w-[32rem] flex-col justify-center px-4 py-12">
    <div
      class="bg-primary-500/10 pointer-events-none absolute inset-x-0 top-6 mx-auto h-32 w-32 rounded-full blur-3xl"
    />

    <div
      class="relative rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/60"
    >
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="mb-6 flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow"
        >
          <span aria-hidden="true">🎬</span>
        </div>
        <div>
          <h1 class="text-xl leading-6 font-semibold text-gray-900 dark:text-gray-100">
            Sign in to Admin
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Access your workspace and tools</p>
        </div>
      </div>

      <div class="mb-6">
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in with your Google account to access the admin panel
        </p>
      </div>

      <Button
        variant="primary"
        size="xl"
        icon="mdi:google"
        :loading="isLoading"
        full-width
        @click="handleProvider('google')"
      >
        Continue with Google
      </Button>

      <p v-if="error" class="mt-4 text-center text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import Button from '@/components/atoms/Button.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

const handleProvider = async (provider: 'google' | 'github' | 'microsoft' | 'apple') => {
  try {
    isLoading.value = true
    error.value = ''
    console.log('🚀 Starting login with provider:', provider)
    const result = await authStore.loginWithProvider(provider)
    console.log('✅ Login result:', result)
    console.log('👤 Auth store user:', authStore.user)
    console.log('🔐 Is authenticated:', authStore.isAuthenticated)

    const redirectPath = (route.query.redirect as string) || '/'
    console.log('🔄 Redirecting to:', redirectPath)
    router.push(redirectPath)
  } catch (err) {
    console.error('❌ Login error:', err)
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await authStore.initialize()
  if (authStore.isAuthenticated) {
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  } else {
    // If not authenticated and no redirect parameter, add default redirect
    if (!route.query.redirect) {
      router.replace({ path: '/auth', query: { redirect: '/' } })
    }
  }
})
</script>
