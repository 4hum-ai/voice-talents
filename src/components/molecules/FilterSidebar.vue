<template>
  <div v-if="show" class="fixed inset-0 z-50 flex justify-end">
    <div
      class="flex h-full w-[380px] flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700"
      >
        <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
        <button
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>
      <div class="flex-1 overflow-auto p-4">
        <slot />
      </div>
      <div class="flex gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
        <Button variant="outline" size="sm" @click="$emit('clear')"> Clear All </Button>
        <Button variant="danger" size="sm" @click="$emit('apply')"> Apply Filters </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'

defineProps<{ title: string; show: boolean }>()
defineEmits(['close', 'clear', 'apply'])
</script>
