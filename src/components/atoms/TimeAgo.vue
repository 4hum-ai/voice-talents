<template>
  <time
    :datetime="isoString"
    :title="fullDate"
    :class="[
      'inline-block',
      size === 'sm' && 'text-xs',
      size === 'md' && 'text-sm',
      size === 'lg' && 'text-base',
      color === 'muted' && 'text-gray-500 dark:text-gray-400',
      color === 'default' && 'text-gray-700 dark:text-gray-300',
      color === 'primary' && 'text-primary-600 dark:text-primary-400',
    ]"
  >
    {{ timeAgoText }}
  </time>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  /** Date to display relative time for */
  date: Date | string | number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant */
  color?: 'muted' | 'default' | 'primary'
  /** Whether to auto-update the time */
  autoUpdate?: boolean
  /** Update interval in milliseconds */
  updateInterval?: number
  /** Whether to show full date on hover */
  showFullDate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'muted',
  autoUpdate: true,
  updateInterval: 60000, // 1 minute
  showFullDate: true,
})

const now = ref(new Date())
let updateTimer: number | null = null

const parsedDate = computed(() => {
  if (props.date instanceof Date) return props.date
  if (typeof props.date === 'number') return new Date(props.date)
  return new Date(props.date)
})

const isoString = computed(() => parsedDate.value.toISOString())

const fullDate = computed(() => {
  if (!props.showFullDate) return ''
  return parsedDate.value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const timeAgoText = computed(() => {
  const diff = now.value.getTime() - parsedDate.value.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  const years = Math.floor(days / 365)
  return `${years}y ago`
})

const startAutoUpdate = () => {
  if (!props.autoUpdate) return

  updateTimer = window.setInterval(() => {
    now.value = new Date()
  }, props.updateInterval)
}

const stopAutoUpdate = () => {
  if (updateTimer) {
    window.clearInterval(updateTimer)
    updateTimer = null
  }
}

onMounted(() => {
  startAutoUpdate()
})

onBeforeUnmount(() => {
  stopAutoUpdate()
})
</script>
