/**
 * Reusable Form Management Composable
 * Handles form state, validation, multi-step navigation, and localStorage persistence
 *
 * Can be used in two ways:
 * 1. Imperative: Pass initialValues and stepValidators directly
 * 2. Declarative: Use with FormDefinition (Typeform/Tripetto-style)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ref, reactive, computed, watch, type Ref } from 'vue'
import type { FormDefinition, FormStep, FormField } from './useFormDefinition'
import {
  generateInitialValues,
  validateField,
  validateStep as validateStepDefinition,
  isFieldVisible,
  isFieldDisabled,
} from './useFormDefinition'

// Re-export types for convenience
export type { FormDefinition, FormStep, FormField } from './useFormDefinition'

export interface FormFieldError {
  field: string
  message: string
}

export interface FormStepValidator {
  (formData: Record<string, any>): boolean | string | Record<string, string>
}

export interface UseFormOptions<T extends Record<string, any>> {
  /** Unique form ID for localStorage key (required if not using definition) */
  formId?: string
  /** Initial form values (required if not using definition) */
  initialValues?: T
  /** Step validators - returns true if valid, or error message string */
  stepValidators?: Record<number, FormStepValidator>
  /** Whether to persist to localStorage (default: true) */
  persistToStorage?: boolean
  /** Field names to exclude from localStorage (e.g., File objects) */
  excludeFromStorage?: string[]
  /** Total number of steps (default: 1, or from definition) */
  totalSteps?: number
  /** Initial step (default: 1) */
  initialStep?: number
  /** Form definition (Typeform/Tripetto-style) - alternative to initialValues */
  definition?: FormDefinition
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  // Support both imperative and declarative approaches
  const definition = options.definition
  const isDeclarative = !!definition

  // If using definition, generate initial values and step validators
  let initialValues: T
  let stepValidators: Record<number, FormStepValidator> = {}
  let totalSteps: number
  let formId: string

  if (isDeclarative) {
    // Declarative approach: use definition
    formId = definition.id
    initialValues = generateInitialValues(definition) as T
    totalSteps = definition.steps.length

    // Generate step validators from definition
    definition.steps.forEach((step) => {
      stepValidators[step.step] = (formData: Record<string, any>) => {
        const result = validateStepDefinition(step, formData)
        if (!result.valid) {
          // Merge field errors into errors object
          Object.keys(result.errors).forEach((field) => {
            if (result.errors[field]) {
              errors[field] = result.errors[field]
            }
          })
          return result.errors['_step'] || 'Step validation failed'
        }
        // Clear errors if valid
        step.fields.forEach((field) => {
          delete errors[field.name]
        })
        delete errors['_step']
        return true
      }
    })
  } else {
    // Imperative approach: use provided values
    if (!options.initialValues) {
      throw new Error('Either initialValues or definition must be provided')
    }
    if (!options.formId) {
      throw new Error('formId is required when not using definition')
    }
    formId = options.formId
    initialValues = options.initialValues
    stepValidators = options.stepValidators || {}
    totalSteps = options.totalSteps || 1
  }

  const { persistToStorage = true, excludeFromStorage = [], initialStep = 1 } = options

  // Storage key
  const STORAGE_KEY = `form_${formId}`

  // Form state
  const formData = reactive<T>({ ...initialValues })
  const errors = reactive<Record<string, string>>({})
  const currentStep = ref(initialStep)
  const touchedFields = ref<Set<string>>(new Set())

  // Initialize form data from localStorage if available
  const loadFromStorage = (): boolean => {
    if (!persistToStorage) return false

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const sessionData = JSON.parse(saved)

        // Restore form data
        if (sessionData.formData) {
          // Deep merge to preserve nested objects
          Object.keys(sessionData.formData).forEach((key) => {
            if (!excludeFromStorage.includes(key)) {
              const savedValue = sessionData.formData[key]
              if (savedValue !== null && savedValue !== undefined) {
                if (
                  typeof savedValue === 'object' &&
                  !Array.isArray(savedValue) &&
                  savedValue.constructor === Object
                ) {
                  // For nested objects, merge properties
                  const currentValue = (formData as Record<string, any>)[key]
                  if (currentValue && typeof currentValue === 'object') {
                    Object.assign(currentValue, savedValue)
                  } else {
                    ;(formData as Record<string, any>)[key] = savedValue
                  }
                } else {
                  // For primitives and arrays, assign directly
                  ;(formData as Record<string, any>)[key] = savedValue
                }
              }
            }
          })
        }

        // Restore current step
        if (
          sessionData.currentStep !== undefined &&
          sessionData.currentStep >= 1 &&
          sessionData.currentStep <= totalSteps
        ) {
          currentStep.value = sessionData.currentStep
        }

        return true
      }
    } catch (error) {
      console.error(`Error loading form data from localStorage for ${formId}:`, error)
    }
    return false
  }

  // Save form data to localStorage
  const saveToStorage = () => {
    if (!persistToStorage) return

    try {
      // Create a copy of formData excluding specified fields
      const dataToSave: Record<string, any> = {}
      Object.keys(formData).forEach((key) => {
        if (!excludeFromStorage.includes(key)) {
          dataToSave[key] = (formData as Record<string, any>)[key]
        }
      })

      const sessionData = {
        formData: dataToSave,
        currentStep: currentStep.value,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error(`Error saving form data to localStorage for ${formId}:`, error)
    }
  }

  // Clear form data from localStorage
  const clearStorage = () => {
    if (!persistToStorage) return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error(`Error clearing form data from localStorage for ${formId}:`, error)
    }
  }

  // Set a single field value
  const setField = <K extends keyof T>(name: K, value: T[K]) => {
    ;(formData as Record<string, any>)[name as string] = value
    // Don't mark as touched on value change - only on blur
    // touchedFields.value.add(name as string)
    // Clear error for this field when value changes
    if (errors[name as string]) {
      delete errors[name as string]
    }
  }

  // Set multiple field values at once
  const setFields = (values: Partial<T>) => {
    Object.keys(values).forEach((key) => {
      const fieldName = key as keyof T
      setField(fieldName, values[fieldName]!)
      // Don't mark as touched on value change - only on blur
      // touchedFields.value.add(key)
    })
  }

  // Get a field value
  const getField = <K extends keyof T>(name: K): T[K] => {
    return (formData as Record<string, any>)[name as string] as T[K]
  }

  // Get all form data
  const getFormData = (): T => {
    return { ...(formData as Record<string, any>) } as T
  }

  // Set field error
  const setFieldError = (field: string, message: string) => {
    errors[field] = message
  }

  // Clear field error
  const clearFieldError = (field: string) => {
    delete errors[field]
  }

  // Get field error (only if field is touched)
  const getFieldError = (field: string, showIfUntouched = false): string | undefined => {
    // Only show error if field is touched (user has interacted with it)
    if (!showIfUntouched && !touchedFields.value.has(field)) {
      return undefined
    }
    return errors[field]
  }

  // Get all errors
  const getErrors = (): Record<string, string> => {
    return { ...errors }
  }

  // Clear all errors
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
  }

  // Validate a single step
  const validateStep = (step: number): boolean => {
    // If using definition, validate using definition
    if (isDeclarative && definition) {
      const stepDef = definition.steps.find((s) => s.step === step)
      if (stepDef) {
        const result = validateStepDefinition(stepDef, formData as Record<string, any>)
        // Update errors
        stepDef.fields.forEach((field) => {
          if (result.errors[field.name]) {
            setFieldError(field.name, result.errors[field.name])
          } else {
            clearFieldError(field.name)
          }
        })
        if (result.errors['_step']) {
          setFieldError(`step_${step}`, result.errors['_step'])
        } else {
          clearFieldError(`step_${step}`)
        }
        return result.valid
      }
    }

    // Imperative approach: use step validators
    const validator = stepValidators[step]
    if (!validator) {
      return true // No validator means step is always valid
    }

    const result = validator(formData)
    if (result === true) {
      // Clear step error if validation passes
      clearFieldError(`step_${step}`)
      return true
    }

    // If validator returns field-specific errors (object)
    if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
      // Set errors for each field
      Object.keys(result).forEach((fieldName) => {
        if (result[fieldName]) {
          setFieldError(fieldName, result[fieldName])
        } else {
          clearFieldError(fieldName)
        }
      })
      // Clear step error since we have field-specific errors
      clearFieldError(`step_${step}`)
      return false
    }

    // If validator returns a string error (legacy - step-level error)
    if (typeof result === 'string') {
      // Set as step-level error (deprecated - prefer field-specific errors)
      setFieldError(`step_${step}`, result)
    }

    return false
  }

  // Get current step definition (if using declarative approach)
  const getCurrentStepDefinition = (): FormStep | undefined => {
    if (isDeclarative && definition) {
      return definition.steps.find((s) => s.step === currentStep.value)
    }
    return undefined
  }

  // Get field definition (if using declarative approach)
  const getFieldDefinition = (fieldName: string): FormField | undefined => {
    if (isDeclarative && definition) {
      for (const step of definition.steps) {
        const field = step.fields.find((f) => f.name === fieldName)
        if (field) return field
      }
    }
    return undefined
  }

  // Check if field is visible (if using declarative approach)
  const isFieldVisibleInStep = (fieldName: string): boolean => {
    if (isDeclarative && definition) {
      const field = getFieldDefinition(fieldName)
      if (field) {
        return isFieldVisible(field, formData as Record<string, any>)
      }
    }
    return true
  }

  // Check if field is disabled (if using declarative approach)
  const isFieldDisabledInStep = (fieldName: string): boolean => {
    if (isDeclarative && definition) {
      const field = getFieldDefinition(fieldName)
      if (field) {
        return isFieldDisabled(field, formData as Record<string, any>)
      }
    }
    return false
  }

  // Validate a single field (if using declarative approach)
  const validateFieldByName = (fieldName: string): string | null => {
    if (isDeclarative && definition) {
      const field = getFieldDefinition(fieldName)
      if (field) {
        const error = validateField(
          field,
          (formData as Record<string, any>)[fieldName],
          formData as Record<string, any>,
        )
        if (error) {
          setFieldError(fieldName, error)
        } else {
          clearFieldError(fieldName)
        }
        return error
      }
    }
    return null
  }

  // Validate all steps
  const validateAll = (): boolean => {
    clearErrors()
    let isValid = true

    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false
      }
    }

    return isValid
  }

  // Check if current step is valid
  const isStepValid = computed(() => {
    // Track formData to make this reactive to data changes
    // Access current step's fields to ensure reactivity
    if (isDeclarative && definition) {
      const stepDef = definition.steps.find((s) => s.step === currentStep.value)
      if (stepDef) {
        // Access each field in the step to track changes
        stepDef.fields.forEach((field) => {
          // Access field value to ensure reactivity tracking
          void (formData as Record<string, any>)[field.name]
        })
      }
    }
    return validateStep(currentStep.value)
  })

  // Check if form is valid
  const isValid = computed(() => {
    return validateAll()
  })

  // Navigate to next step (with validation)
  const nextStep = (): boolean => {
    if (validateStep(currentStep.value)) {
      if (currentStep.value < totalSteps) {
        currentStep.value++
        return true
      }
    }
    return false
  }

  // Navigate to previous step
  const previousStep = (): boolean => {
    if (currentStep.value > 1) {
      currentStep.value--
      return true
    }
    return false
  }

  // Go to specific step
  const goToStep = (step: number): boolean => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
      return true
    }
    return false
  }

  // Reset form to initial values
  const reset = () => {
    Object.assign(formData, initialValues)
    clearErrors()
    touchedFields.value.clear()
    currentStep.value = initialStep
  }

  // Clear form and storage
  const clear = () => {
    reset()
    clearStorage()
  }

  // Mark field as touched (alias for consistency)
  const touchField = (field: string) => {
    touchedFields.value.add(field)
  }

  // Mark field as touched (preferred name) and validate it
  const markFieldAsTouched = (field: string) => {
    touchedFields.value.add(field)
    // Automatically validate the current step when a field is touched
    // This ensures errors appear immediately after blur
    validateStep(currentStep.value)
  }

  // Check if field is touched
  const isFieldTouched = (field: string): boolean => {
    return touchedFields.value.has(field)
  }

  // Auto-save to storage on form changes
  if (persistToStorage) {
    watch(
      formData,
      () => {
        saveToStorage()
      },
      { deep: true },
    )

    // Save step changes
    watch(currentStep, () => {
      saveToStorage()
    })
  }

  // Load from storage on initialization
  if (persistToStorage) {
    loadFromStorage()
  }

  return {
    // State
    formData,
    errors,
    currentStep: currentStep as Ref<number>,
    totalSteps: computed(() => totalSteps),
    touchedFields: computed(() => touchedFields.value),
    isValid,
    isStepValid,

    // Field operations
    setField,
    setFields,
    getField,
    getFormData,
    touchField,
    markFieldAsTouched,
    isFieldTouched,

    // Error operations
    setFieldError,
    clearFieldError,
    getFieldError,
    getErrors,
    clearErrors,

    // Validation
    validateStep,
    validateAll,

    // Step navigation
    nextStep,
    previousStep,
    goToStep,

    // Form operations
    reset,
    clear,

    // Storage operations
    loadFromStorage,
    saveToStorage,
    clearStorage,

    // Declarative form helpers (only available when using definition)
    ...(isDeclarative && definition
      ? {
          definition,
          getCurrentStepDefinition,
          getFieldDefinition,
          isFieldVisibleInStep,
          isFieldDisabledInStep,
          validateFieldByName,
        }
      : {}),
  }
}
