<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outline' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
})

const cardClasses = computed(() => {
  const base = 'rounded-lg border bg-white dark:bg-gray-900'
  const variants = {
    default: 'border-gray-200 shadow-sm dark:border-gray-700',
    outline: 'border-gray-300 dark:border-gray-600',
    elevated: 'border-gray-200 shadow-md dark:border-gray-700',
  }
  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }
  return `${base} ${variants[props.variant]} ${paddings[props.padding]}`
})
</script>
