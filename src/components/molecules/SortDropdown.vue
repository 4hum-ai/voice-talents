<template>
  <div class="inline-flex items-center gap-2">
    <span v-if="label" class="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">{{ label }}</span>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" class="px-2 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      <option v-for="opt in options" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{ options: { key: string; label: string }[]; modelValue: string; label?: string }>()
defineEmits(['update:modelValue'])
</script>


