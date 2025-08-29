<template>
  <div class="flex items-center gap-2">
    <select :value="preset" @change="onPresetChange($event)" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
      <option value="all">All time</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="90d">Last 90 days</option>
      <option value="custom">Custom…</option>
    </select>
    <input v-if="preset==='custom'" type="date" :value="from" @change="onDateChange('from', $event)" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
    <input v-if="preset==='custom'" type="date" :value="to" @change="onDateChange('to', $event)" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ preset: 'all'|'7d'|'30d'|'90d'|'custom'; from?: string; to?: string }>()
const emit = defineEmits<{ change: [payload:{ preset?: string; from?: string; to?: string }] }>()

function onPresetChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as any
  emit('change', { preset: value })
}
function onDateChange(key: 'from'|'to', e: Event) {
  const value = (e.target as HTMLInputElement).value
  const iso = value ? new Date(value).toISOString() : undefined
  emit('change', { preset: 'custom', [key]: iso })
}
</script>


