<template>
  <button :class="buttonClasses" :aria-label="ariaLabel" type="button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  ariaLabel: undefined,
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md border focus:ring-2 focus:outline-none'
  const variants = {
    default:
      'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    ghost:
      'border-transparent bg-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700',
    outline:
      'border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700',
  }
  const sizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

defineEmits<{
  click: []
}>()
</script>
