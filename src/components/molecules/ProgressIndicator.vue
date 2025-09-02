<template>
  <div class="flex items-center gap-2">
    <!-- Progress Bar -->
    <div
      :class="['flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700', sizeClasses.bar]"
    >
      <div
        :class="['h-full transition-all duration-300 ease-out', progressBarClasses]"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>

    <!-- Progress Label (if enabled) -->
    <span
      v-if="showLabel"
      :class="['font-medium text-gray-600 dark:text-gray-400', sizeClasses.label]"
    >
      {{ progressLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Current progress value */
  value: number
  /** Maximum value (defaults to 100) */
  max?: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Progress variant */
  variant?: 'default' | 'success' | 'warning' | 'error'
  /** Show progress text */
  showLabel?: boolean
  /** Animate progress bar */
  animated?: boolean
  /** Custom label format */
  labelFormat?: 'percentage' | 'fraction' | 'custom'
  /** Custom label text */
  customLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  size: 'md',
  variant: 'default',
  showLabel: true,
  animated: true,
  labelFormat: 'percentage',
})

const progressPercentage = computed(() => {
  if (props.max === 0) return 0
  const percentage = (props.value / props.max) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const progressLabel = computed(() => {
  if (props.customLabel) return props.customLabel

  switch (props.labelFormat) {
    case 'percentage':
      return `${Math.round(progressPercentage.value)}%`
    case 'fraction':
      return `${props.value} / ${props.max}`
    default:
      return `${Math.round(progressPercentage.value)}%`
  }
})

const progressBarClasses = computed(() => {
  const baseClasses = 'h-full'
  const animationClasses = props.animated ? 'transition-all duration-300 ease-out' : ''

  let variantClasses = ''
  switch (props.variant) {
    case 'success':
      variantClasses = 'bg-green-500'
      break
    case 'warning':
      variantClasses = 'bg-yellow-500'
      break
    case 'error':
      variantClasses = 'bg-red-500'
      break
    default:
      variantClasses = 'bg-blue-500'
      break
  }

  return [baseClasses, variantClasses, animationClasses].filter(Boolean).join(' ')
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        bar: 'h-1.5',
        label: 'text-xs',
      }
    case 'lg':
      return {
        bar: 'h-3',
        label: 'text-sm',
      }
    default:
      return {
        bar: 'h-2',
        label: 'text-xs',
      }
  }
})
</script>
