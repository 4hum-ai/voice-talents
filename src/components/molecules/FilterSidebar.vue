<template>
  <div v-if="show" class="fixed inset-0 z-50 flex justify-end">
    <div class="h-full w-[380px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">✕</button>
      </div>
      <div class="flex-1 overflow-auto p-4">
        <slot />
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button @click="$emit('clear')" class="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Clear All</button>
        <button @click="$emit('apply')" class="px-3 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white">Apply Filters</button>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
defineProps<{ title: string; show: boolean }>()
defineEmits(['close','clear','apply'])
</script>


