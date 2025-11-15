/**
 * Toast Library
 * Centralized toast notification system
 *
 * Usage:
 * ```ts
 * import { useToast, ToastContainer } from '@/lib/toast'
 * import type { ToastOptions } from '@/lib/toast'
 * ```
 */

// Re-export composables
export { useToast, toast } from './composable'
export type { ToastOptions, ToastData, ToastAction } from './type'

// Re-export components
export { Toast, ToastContainer } from './component'
