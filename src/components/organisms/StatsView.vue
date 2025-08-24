<template>
  <div v-if="stats.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div v-for="stat in stats" :key="stat.key" class="rounded border p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ getStatValue(stat) }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ stats:any[]; data:any[] }>()
const getStatValue = (stat: any) => stat.computed ? props.data?.length || 0 : (stat.value || 0)
</script>


