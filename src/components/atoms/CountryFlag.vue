<template>
  <div
    :class="[
      'inline-block border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800',
      sizeClasses,
      variantClasses,
    ]"
    :style="flagStyle"
  >
    <img
      :src="flagSrc"
      :alt="`Flag of ${countryName}`"
      :width="flagDimensions.width"
      :height="flagDimensions.height"
      :class="['object-cover', sizeClasses]"
      @error="handleFlagError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** ISO country code (e.g., 'us', 'gb', 'de') */
  countryCode: string
  /** Flag size */
  size?: 'sm' | 'md' | 'lg'
  /** Flag shape variant */
  variant?: 'rounded' | 'square' | 'circle'
  /** Fallback flag URL */
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'rounded',
  fallback: undefined,
})

const hasFlagError = ref(false)

const countryName = computed(() => {
  if (!props.countryCode) return 'Unknown'
  return props.countryCode.toUpperCase()
})

const flagDimensions = computed(() => {
  switch (props.size) {
    case 'sm':
      return { width: 16, height: 12 }
    case 'lg':
      return { width: 32, height: 24 }
    default:
      return { width: 24, height: 18 }
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-3'
    case 'lg':
      return 'w-8 h-6'
    default:
      return 'w-6 h-4.5'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'rounded':
      return 'rounded'
    case 'circle':
      return 'rounded-full'
    case 'square':
      return 'rounded-none'
    default:
      return 'rounded'
  }
})

const flagSrc = computed(() => {
  if (hasFlagError.value && props.fallback) {
    return props.fallback
  }

  const code = props.countryCode.toLowerCase()
  // Use flagcdn.com for country flags
  return `https://flagcdn.com/${code}.svg`
})

const flagStyle = computed(() => {
  // Ensure proper aspect ratio for flags (typically 3:2)
  return {
    aspectRatio: '3/2',
  }
})

const handleFlagError = () => {
  hasFlagError.value = true
}
</script>
