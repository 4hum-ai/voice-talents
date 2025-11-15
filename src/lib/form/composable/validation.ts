/**
 * Zod-based validation system for form fields
 * Converts FormField validation rules to Zod schemas
 */

import { z } from 'zod'
import type { FormField, ValidationRule } from './useFormDefinition'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Convert a ValidationRule to a Zod refinement
 */
function applyValidationRule(
  schema: z.ZodTypeAny,
  rule: ValidationRule,
  fieldLabel?: string,
): z.ZodTypeAny {
  switch (rule.type) {
    case 'required':
      // Handled separately in fieldToZodSchema
      return schema

    case 'minLength':
      if (schema instanceof z.ZodString) {
        return schema.min(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be at least ${rule.value} characters`,
        )
      }
      return schema

    case 'maxLength':
      if (schema instanceof z.ZodString) {
        return schema.max(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be no more than ${rule.value} characters`,
        )
      }
      return schema

    case 'min':
      if (schema instanceof z.ZodNumber) {
        return schema.min(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be at least ${rule.value}`,
        )
      }
      // For strings, treat as minLength
      if (schema instanceof z.ZodString) {
        return schema.min(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be at least ${rule.value} characters`,
        )
      }
      return schema

    case 'max':
      if (schema instanceof z.ZodNumber) {
        return schema.max(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be no more than ${rule.value}`,
        )
      }
      // For strings, treat as maxLength
      if (schema instanceof z.ZodString) {
        return schema.max(
          rule.value,
          rule.message || `${fieldLabel || 'Field'} must be no more than ${rule.value} characters`,
        )
      }
      return schema

    case 'pattern': {
      if (schema instanceof z.ZodString) {
        const regex = typeof rule.value === 'string' ? new RegExp(rule.value) : rule.value
        return schema.regex(regex, rule.message || `${fieldLabel || 'Field'} format is invalid`)
      }
      return schema
    }

    case 'email':
      if (schema instanceof z.ZodString) {
        return schema.email(
          rule.message || `${fieldLabel || 'Field'} must be a valid email address`,
        )
      }
      return schema

    case 'url':
      if (schema instanceof z.ZodString) {
        return schema.url(rule.message || `${fieldLabel || 'Field'} must be a valid URL`)
      }
      return schema

    case 'custom':
      // Custom validators need formData, so we'll handle this in validateField
      return schema

    default:
      return schema
  }
}

/**
 * Convert a FormField to a Zod schema
 */
export function fieldToZodSchema(field: FormField): z.ZodTypeAny {
  const fieldLabel = field.label || field.name
  let schema: z.ZodTypeAny

  // Base schema based on field type
  switch (field.type) {
    case 'number':
    case 'range':
      schema = z.number()
      break

    case 'checkbox':
    case 'switch':
      schema = z.boolean()
      break

    case 'multiselect':
    case 'file-multiple':
      schema = z.array(z.any())
      break

    case 'radio':
      // Radio is single select, can be string, number, or boolean
      schema = z.union([z.string(), z.number(), z.boolean()])
      break

    case 'email':
      schema = z.string().email()
      break

    case 'url':
      schema = z.string().url()
      break

    case 'date':
    case 'datetime':
      schema = z.string() // Dates are typically strings in forms
      break

    default:
      schema = z.string()
  }

  // Make optional if not required
  const isRequired = field.required || field.validation?.some((r) => r.type === 'required')
  if (!isRequired) {
    if (schema instanceof z.ZodString) {
      schema = schema.optional().or(z.literal(''))
    } else if (schema instanceof z.ZodNumber) {
      schema = schema.optional().nullable()
    } else if (schema instanceof z.ZodBoolean) {
      schema = schema.optional()
    } else if (schema instanceof z.ZodArray) {
      schema = schema.optional()
    }
  }

  // Apply validation rules (excluding custom validators - handled separately)
  if (field.validation) {
    for (const rule of field.validation) {
      // Skip required rule if field.required is already set (handled above)
      if (rule.type === 'required' && field.required) {
        continue
      }
      // Skip custom validators - they need formData and are handled in validateField
      if (rule.type === 'custom') {
        continue
      }
      schema = applyValidationRule(schema, rule, fieldLabel)
    }
  }

  // Handle required field
  if (isRequired) {
    const requiredMessage =
      field.validation?.find((r) => r.type === 'required')?.message || `${fieldLabel} is required`

    if (field.type === 'checkbox' || field.type === 'switch') {
      // For checkboxes, required means it must be true
      schema = (schema as z.ZodBoolean).refine((val) => val === true, {
        message: requiredMessage,
      })
    } else if (field.type === 'multiselect' || field.type === 'file-multiple') {
      // For arrays, required means non-empty
      schema = (schema as z.ZodArray<any>).min(1, {
        message: requiredMessage,
      })
    } else if (schema instanceof z.ZodString) {
      // For strings, ensure not empty
      schema = schema.min(1, {
        message: requiredMessage,
      })
    } else if (schema instanceof z.ZodNumber) {
      // For numbers, we can't use min(1) as 0 is valid, so use refine
      schema = schema.refine((val) => val !== null && val !== undefined, {
        message: requiredMessage,
      })
    }
  }

  return schema
}

/**
 * Validate a field value using Zod
 */
export function validateField(
  field: FormField,
  value: any,
  formData: Record<string, any>,
): string | null {
  // Check if field is visible (skip validation if hidden)
  if (
    field.visible === false ||
    (typeof field.visible === 'function' && !field.visible(formData))
  ) {
    return null
  }

  // Normalize empty values based on field type
  let normalizedValue = value
  if (value === null || value === undefined) {
    if (field.type === 'number' || field.type === 'range') {
      normalizedValue = undefined // Numbers should be undefined when empty
    } else if (field.type === 'checkbox' || field.type === 'switch') {
      normalizedValue = false // Booleans default to false
    } else if (field.type === 'multiselect' || field.type === 'file-multiple') {
      normalizedValue = [] // Arrays default to empty array
    } else {
      normalizedValue = '' // Strings default to empty string
    }
  }

  // Handle custom validators first (they need formData access)
  if (field.validation) {
    for (const rule of field.validation) {
      if (rule.type === 'custom') {
        const result = rule.validator(normalizedValue, formData)
        if (result !== true) {
          return typeof result === 'string' ? result : `${field.label || field.name} is invalid`
        }
      }
    }
  }

  try {
    const schema = fieldToZodSchema(field)
    schema.parse(normalizedValue)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return first error message
      return error.errors[0]?.message || `${field.label || field.name} is invalid`
    }
    return `${field.label || field.name} is invalid`
  }
}
