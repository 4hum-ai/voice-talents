<template>
  <nav class="flex items-center text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1">
      <li v-for="(crumb, index) in items" :key="index" class="inline-flex items-center">
        <span v-if="index > 0" class="mx-1 text-gray-400 dark:text-gray-500">/</span>
        <RouterLink
          v-if="crumb.to && index < items.length - 1"
          :to="crumb.to"
          class="hover:text-gray-900 dark:hover:text-gray-100"
        >
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="font-medium text-gray-900 dark:text-gray-100">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string | Record<string, { to: string; label: string }>
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>
