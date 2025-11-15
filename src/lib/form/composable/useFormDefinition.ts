/**
 * Form Definition Schema (Typeform/Tripetto-style)
 * Declarative form definition with built-in validation using Zod
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { validateField } from './validation'

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'file'
  | 'file-multiple'
  | 'switch'
  | 'range'
  | 'hidden'

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp | string; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'url'; message?: string }
  | { type: 'custom'; validator: (value: any, formData: Record<string, any>) => boolean | string }

export interface FormField {
  /** Field name (used as key in form data) */
  name: string
  /** Field type */
  type: FieldType
  /** Field label */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Help text */
  helpText?: string
  /** Default value */
  defaultValue?: any
  /** Whether field is required */
  required?: boolean
  /** Validation rules */
  validation?: ValidationRule[]
  /** Options for select/radio/multiselect */
  options?: Array<{ value: any; label: string; disabled?: boolean }>
  /** Field dependencies (show/hide based on other fields) */
  dependencies?: {
    field: string
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan'
    value: any
  }[]
  /** Whether field is disabled */
  disabled?: boolean | ((formData: Record<string, any>) => boolean)
  /** Whether field is visible */
  visible?: boolean | ((formData: Record<string, any>) => boolean)
  /** Custom props for specific field types */
  props?: Record<string, any>
}

export interface FormStep {
  /** Step number */
  step: number
  /** Step title */
  title?: string
  /** Step description */
  description?: string
  /** Fields in this step */
  fields: FormField[]
  /** Step-level validation (runs after field validations) */
  validation?: (formData: Record<string, any>) => boolean | string
  /** Whether step can be skipped */
  skippable?: boolean
}

export interface FormDefinition {
  /** Form ID (for localStorage) */
  id: string
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Form steps */
  steps: FormStep[]
  /** Whether to persist to localStorage (default: true) */
  persistToStorage?: boolean
  /** Fields to exclude from storage */
  excludeFromStorage?: string[]
  /** Initial step (default: 1) */
  initialStep?: number
}

/**
 * Generate initial form values from form definition
 */
export function generateInitialValues(definition: FormDefinition): Record<string, any> {
  const values: Record<string, any> = {}

  definition.steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        values[field.name] = field.defaultValue
      } else {
        // Set default based on field type
        switch (field.type) {
          case 'checkbox':
          case 'switch':
            values[field.name] = false
            break
          case 'multiselect':
          case 'file-multiple':
            values[field.name] = []
            break
          case 'number':
          case 'range':
            values[field.name] = 0
            break
          default:
            values[field.name] = ''
        }
      }
    })
  })

  return values
}

/**
 * Validate a single field value using Zod
 * Re-exported from validation.ts
 */
export { validateField }

/**
 * Validate a step
 */
export function validateStep(
  step: FormStep,
  formData: Record<string, any>,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  // Validate all fields in step
  step.fields.forEach((field) => {
    const value = formData[field.name]
    const error = validateField(field, value, formData)
    if (error) {
      errors[field.name] = error
    }
  })

  // Run step-level validation if all fields are valid
  if (Object.keys(errors).length === 0 && step.validation) {
    const stepResult = step.validation(formData)
    if (stepResult !== true) {
      // Step validation failed - add as step error
      errors['_step'] = typeof stepResult === 'string' ? stepResult : 'Step validation failed'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Check if field should be visible based on dependencies
 */
export function isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
  if (field.visible === false) {
    return false
  }

  if (typeof field.visible === 'function') {
    return field.visible(formData)
  }

  // Check dependencies
  if (field.dependencies && field.dependencies.length > 0) {
    return field.dependencies.every((dep) => {
      const depValue = formData[dep.field]
      switch (dep.operator) {
        case 'equals':
          return depValue === dep.value
        case 'notEquals':
          return depValue !== dep.value
        case 'contains':
          return Array.isArray(depValue)
            ? depValue.includes(dep.value)
            : String(depValue).includes(String(dep.value))
        case 'notContains':
          return Array.isArray(depValue)
            ? !depValue.includes(dep.value)
            : !String(depValue).includes(String(dep.value))
        case 'greaterThan':
          return Number(depValue) > Number(dep.value)
        case 'lessThan':
          return Number(depValue) < Number(dep.value)
        default:
          return true
      }
    })
  }

  return true
}

/**
 * Check if field should be disabled
 */
export function isFieldDisabled(field: FormField, formData: Record<string, any>): boolean {
  if (typeof field.disabled === 'function') {
    return field.disabled(formData)
  }
  return field.disabled === true
}
