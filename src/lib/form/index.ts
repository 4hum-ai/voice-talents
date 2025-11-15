/**
 * Form Library
 * Centralized form management system with declarative form definitions
 *
 * Usage:
 * ```ts
 * import { useForm } from '@/lib/form'
 * import type { FormDefinition } from '@/lib/form'
 * ```
 */

// Re-export composables
export { useForm } from './composable'
export type { UseFormOptions } from './composable/useForm'

// Re-export types
export type {
  FormDefinition,
  FormStep,
  FormField,
  FieldType,
  ValidationRule,
  FormFieldError,
  FormStepValidator,
} from './type'

// Re-export utilities
export {
  generateInitialValues,
  validateField,
  validateStep,
  isFieldVisible,
  isFieldDisabled,
} from './composable'

// Re-export form components
export {
  FormInput, // Generic input (deprecated - use DynamicInput or specific inputs)
  DynamicInput, // Dynamic input that renders the correct component based on type
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  DateInput,
  SelectInput,
  Textarea,
  Checkbox,
  FileUpload,
  FileInput,
  MultiSelectInput,
  RadioInput,
  SwitchInput,
  RangeInput,
  DateRangeInput,
  TagInput,
  BudgetRangeInput,
  FormSection,
  ArrayInput,
  ObjectInput,
  JsonInput,
} from './component'
