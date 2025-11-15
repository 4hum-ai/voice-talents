/**
 * Form-related TypeScript types
 * Centralized type definitions for form system
 */

// Re-export from composable
export type {
  FormDefinition,
  FormStep,
  FormField,
  FieldType,
  ValidationRule,
} from '../composable/useFormDefinition'

// Re-export from useForm
export type { FormFieldError, FormStepValidator, UseFormOptions } from '../composable/useForm'

// Legacy form types (from types/forms.ts - kept for backward compatibility)
export interface FormData {
  [key: string]: string | number | boolean | string[] | File | undefined
}

export interface VoiceSampleFormData {
  [voiceType: string]: unknown // Media type
}

export interface OnboardingData {
  [key: string]: unknown
}
