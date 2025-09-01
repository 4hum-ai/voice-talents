<template>
  <div class="flex items-center gap-2">
    <input
      type="date"
      :value="from"
      class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      @change="$emit('update:from', ($event.target as HTMLInputElement).value)"
    />
    <input
      type="date"
      :value="to"
      class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      @change="$emit('update:to', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  from?: string
  to?: string
}

defineProps<Props>()
defineEmits<{
  'update:from': [value: string]
  'update:to': [value: string]
}>()
</script>
