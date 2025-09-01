<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :class="inputClasses"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date'
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
})

const inputClasses = computed(() => {
  const base =
    'rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  }
  return `${base} ${sizes[props.size]}`
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
