<template>
  <div class="min-w-0 flex-1">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
    />
  </div>
  
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
defineEmits(['update:modelValue'])
</script>


