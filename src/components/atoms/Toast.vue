<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      :class="toastClasses"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <Icon :name="iconName" :class="iconClasses" aria-hidden="true" />
        </div>
        <div class="ml-3 w-0 flex-1">
          <p v-if="title" :class="titleClasses">
            {{ title }}
          </p>
          <p v-if="message" :class="messageClasses">
            {{ message }}
          </p>
          <div v-if="action" class="mt-3">
            <Button
              :variant="action.variant || 'outline'"
              :size="action.size || 'sm'"
              @click="handleAction"
            >
              {{ action.label }}
            </Button>
          </div>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button
            class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800"
            @click="close"
          >
            <span class="sr-only">Close</span>
            <Icon name="mdi:close" class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Button from './Button.vue'
import Icon from './Icon.vue'

interface ToastAction {
  label: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

interface Props {
  id?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  duration?: number
  action?: ToastAction
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  persistent: false,
})

const emit = defineEmits<{
  close: []
  action: [action: ToastAction]
}>()

const show = ref(false)

const iconName = computed(() => {
  const icons = {
    success: 'mdi:check-circle',
    error: 'mdi:alert-circle',
    warning: 'mdi:alert',
    info: 'mdi:information',
  }
  return icons[props.type]
})

const toastClasses = computed(() => {
  const base =
    'max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'

  const variants = {
    success: 'border-l-4 border-green-400',
    error: 'border-l-4 border-red-400',
    warning: 'border-l-4 border-yellow-400',
    info: 'border-l-4 border-blue-400',
  }

  return `${base} ${variants[props.type]}`
})

const iconClasses = computed(() => {
  const variants = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }
  return `h-5 w-5 ${variants[props.type]}`
})

const titleClasses = computed(() => {
  const variants = {
    success: 'text-sm font-medium text-green-800 dark:text-green-200',
    error: 'text-sm font-medium text-red-800 dark:text-red-200',
    warning: 'text-sm font-medium text-yellow-800 dark:text-yellow-200',
    info: 'text-sm font-medium text-blue-800 dark:text-blue-200',
  }
  return variants[props.type]
})

const messageClasses = computed(() => {
  const variants = {
    success: 'mt-1 text-sm text-green-700 dark:text-green-300',
    error: 'mt-1 text-sm text-red-700 dark:text-red-300',
    warning: 'mt-1 text-sm text-yellow-700 dark:text-yellow-300',
    info: 'mt-1 text-sm text-blue-700 dark:text-blue-300',
  }
  return variants[props.type]
})

let timeoutId: number | null = null

const close = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for transition to complete
}

const handleAction = () => {
  if (props.action?.onClick) {
    props.action.onClick()
  }
  emit('action', props.action!)
}

onMounted(() => {
  show.value = true

  if (!props.persistent && props.duration > 0) {
    timeoutId = window.setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>
