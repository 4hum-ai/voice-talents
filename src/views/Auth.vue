<template>
  <div class="mx-auto flex max-w-[28rem] flex-col justify-center py-10 text-start">
    <h1 class="mb-6 text-2xl font-semibold">Sign in to Admin</h1>

    <form @submit.prevent="handleEmailLogin" class="space-y-3">
      <input v-model="email" type="email" placeholder="Email" class="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required />
      <input v-model="password" type="password" placeholder="Password" class="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" required />
      <button :disabled="isLoading" class="btn-primary w-full">{{ isLoading ? 'Signing in...' : 'Sign In' }}</button>
    </form>

    <div class="relative my-6">
      <hr class="text-zinc-700" />
      <span class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-zinc-950 px-2 text-zinc-400">Or</span>
    </div>

    <button class="btn-secondary flex items-center justify-center gap-2" @click="handleGoogleLogin" :disabled="isLoading">
      <span class="font-medium">Continue with Google</span>
    </button>

    <p v-if="error" class="mt-4 text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleGoogleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.loginWithGoogleUser()
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Google login failed'
  } finally {
    isLoading.value = false
  }
}

const handleEmailLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.loginUser({ email: email.value, password: password.value })
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  } catch (err) {
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
  }
})
</script>


