<template>
  <div :class="['border-border bg-card rounded-lg border', sizeClasses.padding, customClass]">
    <!-- Header slot -->
    <slot
      name="header"
      :title="title"
      :icon="icon"
      :icon-classes="iconClasses"
      :size-classes="sizeClasses"
      :trend="trend"
      :trend-icon="trendIcon"
      :trend-icon-classes="trendIconClasses"
      :trend-text="trendText"
      :trend-text-classes="trendTextClasses"
    >
      <div class="mb-3 flex items-start justify-between">
        <div class="flex items-center gap-2">
          <!-- Icon slot -->
          <slot name="icon" :icon="icon" :icon-classes="iconClasses" :size-classes="sizeClasses">
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
          </slot>

          <!-- Title slot -->
          <slot name="title" :title="title" :size-classes="sizeClasses">
            <h3 :class="['text-foreground font-medium', sizeClasses.title]">
              {{ title }}
            </h3>
          </slot>
        </div>

        <!-- Trend slot -->
        <slot
          name="trend"
          :trend="trend"
          :trend-icon="trendIcon"
          :trend-icon-classes="trendIconClasses"
          :trend-text="trendText"
          :trend-text-classes="trendTextClasses"
        >
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
        </slot>
      </div>
    </slot>

    <!-- Main content slot -->
    <slot
      name="content"
      :value="value"
      :formatted-value="formattedValue"
      :subtitle="subtitle"
      :size-classes="sizeClasses"
    >
      <!-- Value slot -->
      <slot
        name="value"
        :value="value"
        :formatted-value="formattedValue"
        :size-classes="sizeClasses"
      >
        <div class="mb-1">
          <span :class="['text-foreground font-bold', sizeClasses.value]">
            {{ formattedValue }}
          </span>
        </div>
      </slot>

      <!-- Subtitle slot -->
      <slot name="subtitle" :subtitle="subtitle" :size-classes="sizeClasses">
        <p v-if="subtitle" :class="['text-muted-foreground', sizeClasses.subtitle]">
          {{ subtitle }}
        </p>
      </slot>
    </slot>

    <!-- Footer slot -->
    <slot name="footer" :value="value" :trend="trend" :title="title" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import TrendingUpIcon from '~icons/mdi/trending-up'
import TrendingDownIcon from '~icons/mdi/trending-down'
import MinusIcon from '~icons/mdi/minus'
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
  /** Custom CSS classes */
  customClass?: string
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
      return TrendingUpIcon
    case 'down':
      return TrendingDownIcon
    default:
      return MinusIcon
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
      return 'text-muted-foreground'
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
      return 'text-muted-foreground'
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
