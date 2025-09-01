<template>
  <div v-if="stats.length > 0" class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.key"
      class="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ getStatValue(stat) }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ stats: unknown[]; data: unknown[] }>()
const getStatValue = (stat: unknown) => (stat.computed ? props.data?.length || 0 : stat.value || 0)
</script>
