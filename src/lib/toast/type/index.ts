/**
 * Toast Library Types
 */

export interface ToastOptions {
  id?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  body?: string
  duration?: number
  timeout?: number
  persistent?: boolean
  position?: string
  action?: {
    label: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
  }
}

export interface ToastData {
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

export interface ToastAction {
  label: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}
