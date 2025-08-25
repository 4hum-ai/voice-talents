<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div class="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ message }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button @click="$emit('cancel')" class="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">{{ cancelLabel || 'Cancel' }}</button>
        <button @click="$emit('confirm')" class="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">{{ confirmLabel || 'Confirm' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string }>()
defineEmits(['confirm','cancel'])
</script>


