<template>
  <main class="p-6">
    <div
      class="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="text-6xl font-bold text-gray-900 dark:text-gray-100">404</div>
      <h2 class="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Page not found</h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Button variant="primary" size="sm" custom-class="mt-4" @click="router.push('/')">
        Go home
      </Button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/atoms/Button.vue'

const router = useRouter()
</script>
