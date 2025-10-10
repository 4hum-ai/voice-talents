<template>
  <span
    :class="[
      'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
      statusClasses,
      size === 'sm' && 'px-1.5 py-0.5 text-xs',
      size === 'md' && 'px-2 py-0.5 text-xs',
      size === 'lg' && 'px-3 py-1 text-sm',
      variant === 'outline' && 'border',
      variant === 'solid' && 'text-white',
      customClass,
    ]"
  >
    <!-- Status dot slot -->
    <slot name="dot" :status="status" :size="dotSize" :show-dot="showDot">
      <StatusDot v-if="showDot" :status="status" :size="dotSize" class="mr-1.5" />
    </slot>

    <!-- Main content slot -->
    <slot name="content" :status="status" :label="label">
      <slot>{{ label || status }}</slot>
    </slot>

    <!-- Icon slot -->
    <slot name="icon" :status="status" :size="size" :status-classes="statusClasses" />

    <!-- Action slot -->
    <slot name="action" :status="status" :label="label" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusDot from './StatusDot.vue'

interface Props {
  /** Status type */
  status?:
    | 'active'
    | 'success'
    | 'paid'
    | 'online'
    | 'pending'
    | 'warning'
    | 'inactive'
    | 'offline'
    | 'suspended'
    | 'error'
    | 'failed'
    | 'draft'
    | 'published'
    | 'archived'
    | 'processing'
    | 'completed'
    | 'queued'
    | 'cancelled'
    | 'needs_review'
    | 'approved'
    | 'rejected'
  /** Custom label text */
  label?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant */
  variant?: 'solid' | 'outline' | 'soft'
  /** Whether to show status dot */
  showDot?: boolean
  /** Custom CSS classes */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'active',
  size: 'md',
  variant: 'soft',
  showDot: false,
})

const dotSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'sm'
    default:
      return 'xs'
  }
})

const statusClasses = computed(() => {
  const status = props.status

  if (props.variant === 'solid') {
    switch (status) {
      case 'active':
      case 'success':
      case 'paid':
      case 'online':
        return 'bg-green-600 border-green-600'
      case 'pending':
      case 'warning':
        return 'bg-yellow-600 border-yellow-600'
      case 'inactive':
      case 'offline':
      case 'draft':
        return 'bg-gray-600 border-gray-600'
      case 'suspended':
      case 'error':
      case 'failed':
        return 'bg-red-600 border-red-600'
      case 'published':
        return 'bg-blue-600 border-blue-600'
      case 'archived':
        return 'bg-purple-600 border-purple-600'
      case 'processing':
        return 'bg-blue-600 border-blue-600'
      case 'completed':
        return 'bg-green-600 border-green-600'
      case 'queued':
        return 'bg-gray-600 border-gray-600'
      case 'cancelled':
        return 'bg-red-600 border-red-600'
      case 'needs_review':
        return 'bg-yellow-600 border-yellow-600'
      case 'approved':
        return 'bg-green-600 border-green-600'
      case 'rejected':
        return 'bg-red-600 border-red-600'
      default:
        return 'bg-gray-600 border-gray-600'
    }
  } else if (props.variant === 'outline') {
    switch (status) {
      case 'active':
      case 'success':
      case 'paid':
      case 'online':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'pending':
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'inactive':
      case 'offline':
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      case 'suspended':
      case 'error':
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'published':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      case 'archived':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'queued':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'needs_review':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  } else {
    // soft variant (default)
    switch (status) {
      case 'active':
      case 'success':
      case 'paid':
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'inactive':
      case 'offline':
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'suspended':
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'published':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'archived':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'queued':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }
})
</script>
