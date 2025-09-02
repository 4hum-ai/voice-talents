<template>
  <div
    :class="[
      'rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800',
      sizeClasses.padding,
    ]"
  >
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-2">
        <!-- Icon -->
        <div v-if="icon" :class="['flex-shrink-0 rounded-lg p-2', iconClasses]">
          <Icon
            v-if="typeof icon === 'string'"
            :name="icon"
            :class="['text-white', sizeClasses.icon]"
            aria-hidden="true"
          />
          <component
            v-else
            :is="icon"
            :class="['text-white', sizeClasses.icon]"
            aria-hidden="true"
          />
        </div>

        <!-- Title -->
        <h3 :class="['font-medium text-gray-900 dark:text-gray-100', sizeClasses.title]">
          {{ title }}
        </h3>
      </div>

      <!-- Trend Indicator -->
      <div v-if="trend" class="flex items-center gap-1">
        <component
          :is="trendIcon"
          :class="['flex-shrink-0', trendIconClasses]"
          aria-hidden="true"
        />
        <span :class="['font-medium', trendTextClasses]">
          {{ trendText }}
        </span>
      </div>
    </div>

    <!-- Value -->
    <div class="mb-1">
      <span :class="['font-bold text-gray-900 dark:text-gray-100', sizeClasses.value]">
        {{ formattedValue }}
      </span>
    </div>

    <!-- Subtitle -->
    <p v-if="subtitle" :class="['text-gray-500 dark:text-gray-400', sizeClasses.subtitle]">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  /** Metric title */
  title: string
  /** Metric value */
  value: string | number
  /** Metric subtitle */
  subtitle?: string
  /** Metric icon */
  icon?: string | Component
  /** Icon background color variant */
  iconVariant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** Trend information */
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period: string
  }
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  iconVariant: 'primary',
  size: 'md',
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('en-US').format(props.value)
  }
  return props.value
})

const trendIcon = computed(() => {
  if (!props.trend) return null

  switch (props.trend.direction) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
})

const trendText = computed(() => {
  if (!props.trend) return ''

  const value = Math.abs(props.trend.value)
  const period = props.trend.period

  switch (props.trend.direction) {
    case 'up':
      return `+${value}% ${period}`
    case 'down':
      return `-${value}% ${period}`
    default:
      return `0% ${period}`
  }
})

const trendIconClasses = computed(() => {
  if (!props.trend) return ''

  switch (props.trend.direction) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    default:
      return 'text-gray-400'
  }
})

const trendTextClasses = computed(() => {
  if (!props.trend) return ''

  switch (props.trend.direction) {
    case 'up':
      return 'text-green-600 dark:text-green-400'
    case 'down':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const iconClasses = computed(() => {
  switch (props.iconVariant) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-primary-500'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        padding: 'p-3',
        title: 'text-sm',
        value: 'text-lg',
        subtitle: 'text-xs',
        icon: 'w-4 h-4',
      }
    case 'lg':
      return {
        padding: 'p-6',
        title: 'text-lg',
        value: 'text-3xl',
        subtitle: 'text-base',
        icon: 'w-6 h-6',
      }
    default:
      return {
        padding: 'p-4',
        title: 'text-base',
        value: 'text-2xl',
        subtitle: 'text-sm',
        icon: 'w-5 h-5',
      }
  }
})
</script>
