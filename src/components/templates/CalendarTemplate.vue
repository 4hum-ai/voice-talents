<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="true" @back="router.back()">
      <template #left>
        <div class="min-w-0">
          <div class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ uiConfig?.displayName || resourceName }}
          </div>
          <div class="truncate text-xs text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </div>
        </div>
      </template>
    </AppBar>

    <main class="px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppBar from '../molecules/AppBar.vue'

// ✅ define props with correct defaults
withDefaults(
  defineProps<{
    uiConfig?: { displayName?: string }
    resourceName?: string
    subtitle?: string
    loading?: boolean
  }>(),
  {
    uiConfig: () => ({}),
    resourceName: '',
    subtitle: '',
    loading: false,
  },
)

const router = useRouter()
</script>
