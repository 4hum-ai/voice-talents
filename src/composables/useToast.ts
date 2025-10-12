import { ref } from 'vue'

interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
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

export function useToast() {
  const addToast = (options: ToastOptions) => {
    const id = `toast-${++toastIdCounter}`
    const toast: ToastData = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration,
      persistent: options.persistent,
      action: options.action,
    }

    toasts.value.push(toast)
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

  // Convenience methods
  const success = (message: string, title?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'success',
      title,
      message,
      duration: 4000,
      ...options,
    })
  }

  const error = (message: string, title?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 6000,
      ...options,
    })
  }

  const warning = (message: string, title?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration: 5000,
      ...options,
    })
  }

  const info = (message: string, title?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options,
    })
  }

  return {
    toasts: toasts.value,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  }
}

// Global toast instance for app-wide use
export const toast = useToast()
