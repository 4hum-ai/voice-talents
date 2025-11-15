/**
 * Form Components
 * Re-export all form-related components for easy importing
 *
 * Usage:
 * ```vue
 * <script setup>
 * import { FormInput, SelectInput, FileUpload } from '@/lib/form/component'
 * </script>
 * ```
 */

// Core form input components
export { default as FormInput } from './util/FormInput.vue' // Generic input (deprecated - use DynamicInput or specific inputs)
export { default as DynamicInput } from './util/DynamicInput.vue' // Dynamic input that renders the correct component based on type
export { default as TextInput } from './input/TextInput.vue'
export { default as EmailInput } from './input/EmailInput.vue'
export { default as PasswordInput } from './input/PasswordInput.vue'
export { default as NumberInput } from './input/NumberInput.vue'
export { default as DateInput } from './input/DateInput.vue'
export { default as SelectInput } from './input/SelectInput.vue'
export { default as Textarea } from './input/Textarea.vue'
export { default as Checkbox } from './input/Checkbox.vue'
export { default as FileUpload } from './input/FileUpload.vue'
export { default as FileInput } from './input/FileInput.vue'

// New input components
export { default as MultiSelectInput } from './input/MultiSelectInput.vue'
export { default as RadioInput } from './input/RadioInput.vue'
export { default as SwitchInput } from './input/SwitchInput.vue'
export { default as RangeInput } from './input/RangeInput.vue'

// Advanced form components
export { default as DateRangeInput } from './input/DateRangeInput.vue'
export { default as TagInput } from './input/TagInput.vue'
export { default as BudgetRangeInput } from './input/BudgetRangeInput.vue'
export { default as FormSection } from './layout/FormSection.vue'

// Specialized input components
export { default as ArrayInput } from './input/ArrayInput.vue'
export { default as ObjectInput } from './input/ObjectInput.vue'
export { default as JsonInput } from './input/JsonInput.vue'
