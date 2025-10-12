<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        move-class="transition-transform duration-300"
      >
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          v-bind="toast"
          @close="removeToast(toast.id)"
          @action="handleToastAction"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from '@/components/atoms/Toast.vue'

interface ToastData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
  }
}

const toasts = ref<ToastData[]>([])

let toastIdCounter = 0

const addToast = (toast: Omit<ToastData, 'id'>) => {
  const id = `toast-${++toastIdCounter}`
  toasts.value.push({ ...toast, id })
  return id
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAllToasts = () => {
  toasts.value = []
}

const handleToastAction = () => {
  // Handle toast action if needed
}

// Expose methods for global use
defineExpose({
  addToast,
  removeToast,
  clearAllToasts,
})
</script>
