<template>
  <div
    :class="[
      'rounded-lg border border-dashed border-gray-200 bg-white text-center dark:border-gray-700 dark:bg-gray-900',
      size === 'sm' && 'py-8',
      size === 'md' && 'py-12',
      size === 'lg' && 'py-16',
      size === 'xl' && 'py-20',
      preset === 'search' && 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
      preset === 'error' && 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
      preset === 'success' &&
        'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
      preset === 'warning' &&
        'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
      preset === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      preset === 'custom' && customClass,
    ]"
  >
    <div
      v-if="icon !== false"
      :class="[
        'mx-auto text-gray-400 dark:text-gray-500',
        size === 'sm' && 'h-8 w-8',
        size === 'md' && 'h-10 w-10',
        size === 'lg' && 'h-12 w-12',
        size === 'xl' && 'h-16 w-16',
      ]"
      aria-hidden="true"
    >
      <slot name="icon">
        <!-- Default icon based on preset -->
        <Icon :name="`mdi:${getPresetIcon(preset)}`" class="mx-auto h-full w-full" />
      </slot>
    </div>

    <h3
      :class="[
        'mt-4 font-semibold text-gray-900 dark:text-gray-100',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
      ]"
    >
      {{ title }}
    </h3>

    <p
      v-if="subtitle"
      :class="[
        'mt-1 text-gray-500 dark:text-gray-400',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-sm',
        size === 'xl' && 'text-base',
      ]"
    >
      {{ subtitle }}
    </p>

    <div
      v-if="$slots.actions"
      :class="[
        'mt-6 flex items-center justify-center gap-3',
        size === 'sm' && 'mt-4',
        size === 'md' && 'mt-5',
        size === 'lg' && 'mt-6',
        size === 'xl' && 'mt-8',
      ]"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  /** Title text */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Whether to show icon */
  icon?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Preset style */
  preset?: 'default' | 'search' | 'error' | 'success' | 'warning' | 'info' | 'custom'
  /** Custom CSS classes when preset is 'custom' */
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  icon: true,
  size: 'lg',
  preset: 'default',
})

const getPresetIcon = (preset: string) => {
  const iconMap: Record<string, string> = {
    search: 'magnify',
    error: 'alert-circle',
    success: 'check-circle',
    warning: 'alert',
    info: 'information',
    default: 'plus-circle',
  }
  return iconMap[preset] || 'plus-circle'
}
</script>
