/**
 * Base utilities and types for form input components
 * Ensures consistency across all form inputs
 */

export type InputSize = 'sm' | 'md' | 'lg'
export type ValidationState = 'default' | 'success' | 'error' | 'warning'

export interface BaseFormInputProps {
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Help text below the input */
  helpText?: string
  /** Error message */
  error?: string
  /** Input size */
  size?: InputSize
  /** Validation state (auto-derived from error if not provided) */
  validationState?: ValidationState
}

export const defaultBaseProps = {
  size: 'md' as const,
  validationState: 'default' as const,
}

/**
 * Generate consistent input ID
 */
export function generateInputId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get validation state from error prop or explicit validationState
 */
export function getValidationState(
  error?: string,
  validationState?: ValidationState,
): ValidationState {
  if (error) return 'error'
  return validationState || 'default'
}

/**
 * Standard label classes
 */
export function getLabelClasses(size: InputSize): string {
  const base = 'block font-medium text-foreground'
  const sizes = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-base mb-2',
  }
  return `${base} ${sizes[size]}`
}

/**
 * Standard help text classes
 */
export function getHelpTextClasses(size: InputSize): string {
  const base = 'mt-1 text-muted-foreground'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[size]}`
}

/**
 * Standard error classes
 */
export function getErrorClasses(size: InputSize): string {
  const base = 'mt-1 text-red-600 dark:text-red-400'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[size]}`
}

/**
 * Standard border classes based on validation state
 */
export function getBorderClasses(validationState: ValidationState): string {
  const base = 'border focus:outline-none focus:ring-2 focus:ring-offset-0'

  switch (validationState) {
    case 'success':
      return `${base} border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400 dark:focus:ring-green-400`
    case 'error':
      return `${base} border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400`
    case 'warning':
      return `${base} border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-600 dark:focus:border-yellow-400 dark:focus:ring-yellow-400`
    default:
      return `${base} border-border focus:border-primary focus:ring-primary`
  }
}

/**
 * Standard input size classes
 */
export function getInputSizeClasses(size: InputSize, includeHeight = false): string {
  const sizes = {
    sm: includeHeight ? 'px-2 py-1 text-xs h-[32px]' : 'px-2 py-1 text-xs',
    md: includeHeight ? 'px-3 py-2 text-sm h-[42px]' : 'px-3 py-2 text-sm',
    lg: includeHeight ? 'px-4 py-3 text-base h-[48px]' : 'px-4 py-3 text-base',
  }
  return sizes[size]
}
