<template>
  <span
    :class="[
      'inline-block rounded-full',
      dotClasses,
      size === 'xs' && 'h-1.5 w-1.5',
      size === 'sm' && 'h-2 w-2',
      size === 'md' && 'h-2.5 w-2.5',
      size === 'lg' && 'h-3 w-3',
      size === 'xl' && 'h-4 w-4',
    ]"
    :aria-label="`Status: ${status}`"
    role="status"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Whether to animate the dot */
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: 'active',
  size: 'sm',
  animate: false,
})

const dotClasses = computed(() => {
  const baseClasses = props.animate ? 'animate-pulse' : ''

  switch (props.status) {
    case 'active':
    case 'success':
    case 'paid':
    case 'online':
      return `${baseClasses} bg-green-500`
    case 'pending':
    case 'warning':
      return `${baseClasses} bg-yellow-500`
    case 'inactive':
    case 'offline':
    case 'draft':
      return `${baseClasses} bg-gray-400`
    case 'suspended':
    case 'error':
    case 'failed':
      return `${baseClasses} bg-red-500`
    case 'published':
      return `${baseClasses} bg-blue-500`
    case 'archived':
      return `${baseClasses} bg-purple-500`
    case 'processing':
      return `${baseClasses} bg-blue-500`
    case 'completed':
      return `${baseClasses} bg-green-500`
    case 'queued':
      return `${baseClasses} bg-gray-400`
    case 'cancelled':
      return `${baseClasses} bg-red-500`
    case 'needs_review':
      return `${baseClasses} bg-yellow-500`
    case 'approved':
      return `${baseClasses} bg-green-500`
    case 'rejected':
      return `${baseClasses} bg-red-500`
    default:
      return `${baseClasses} bg-gray-400`
  }
})
</script>
