/**
 * Unit tests for useForm composable
 * Tests the full flow: initialization, field operations, validation, step navigation, and persistence
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useForm } from '@/lib/form'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Setup localStorage mock for Node.js environment
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.localStorage = localStorageMock as any
} else {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
}

describe('useForm', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('Initialization', () => {
    it('should initialize with form data', () => {
      const initialValues = {
        title: '',
        description: '',
        email: '',
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      expect(form.getFormData()).toEqual(initialValues)
      expect(form.getField('title')).toBe('')
      expect(form.getField('description')).toBe('')
      expect(form.getField('email')).toBe('')
    })

    it('should initialize with default values', () => {
      const initialValues = {
        title: 'Default Title',
        description: 'Default Description',
        count: 0,
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      expect(form.getField('title')).toBe('Default Title')
      expect(form.getField('description')).toBe('Default Description')
      expect(form.getField('count')).toBe(0)
    })

    it('should start at step 1 by default', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      expect(form.currentStep.value).toBe(1)
    })

    it('should start at specified initial step', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        initialStep: 3,
        totalSteps: 5,
      })

      expect(form.currentStep.value).toBe(3)
    })
  })

  describe('Field Operations', () => {
    it('should set a single field value', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
      })

      form.setField('title', 'New Title')

      expect(form.getField('title')).toBe('New Title')
      expect(form.getField('description')).toBe('')
    })

    it('should set multiple field values at once', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '', email: '' },
      })

      form.setFields({
        title: 'New Title',
        description: 'New Description',
        email: 'test@example.com',
      })

      expect(form.getField('title')).toBe('New Title')
      expect(form.getField('description')).toBe('New Description')
      expect(form.getField('email')).toBe('test@example.com')
    })

    it('should get field value', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: 'Initial Title' },
      })

      expect(form.getField('title')).toBe('Initial Title')
    })

    it('should get all form data', () => {
      const initialValues = {
        title: 'Title',
        description: 'Description',
        count: 42,
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      const formData = form.getFormData()
      expect(formData).toEqual(initialValues)
      expect(formData).not.toBe(form.formData) // Should be a copy
    })

    it('should handle nested objects', () => {
      const initialValues = {
        user: {
          name: '',
          email: '',
        },
        settings: {
          theme: 'light',
        },
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      form.setField('user', { name: 'John', email: 'john@example.com' })

      expect(form.getField('user')).toEqual({
        name: 'John',
        email: 'john@example.com',
      })
    })
  })

  describe('Field Tracking', () => {
    it('should mark field as touched when setting value', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
      })

      expect(form.isFieldTouched('title')).toBe(false)

      form.setField('title', 'New Title')

      expect(form.isFieldTouched('title')).toBe(true)
      expect(form.isFieldTouched('description')).toBe(false)
    })

    it('should manually mark field as touched', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.touchField('title')

      expect(form.isFieldTouched('title')).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should validate step with validator function', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => !!data.description || 'Description is required',
        },
        totalSteps: 2,
      })

      // Step 1 should be invalid (no title)
      expect(form.validateStep(1)).toBe(false)
      expect(form.getFieldError('step_1')).toBe('Title is required')

      // Set title and validate again
      form.setField('title', 'My Title')
      expect(form.validateStep(1)).toBe(true)
      expect(form.getFieldError('step_1')).toBeUndefined()
    })

    it('should return true for step without validator', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        totalSteps: 2,
      })

      expect(form.validateStep(1)).toBe(true)
      expect(form.validateStep(2)).toBe(true)
    })

    it('should validate all steps', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => !!data.description || 'Description is required',
        },
        totalSteps: 2,
      })

      // Both steps invalid
      expect(form.validateAll()).toBe(false)

      // Fix step 1
      form.setField('title', 'My Title')
      expect(form.validateAll()).toBe(false) // Step 2 still invalid

      // Fix step 2
      form.setField('description', 'My Description')
      expect(form.validateAll()).toBe(true)
    })

    it('should compute step validity reactively', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
        },
        totalSteps: 1,
      })

      expect(form.isStepValid.value).toBe(false)

      form.setField('title', 'My Title')

      expect(form.isStepValid.value).toBe(true)
    })

    it('should compute overall form validity', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => !!data.description || 'Description is required',
        },
        totalSteps: 2,
      })

      expect(form.isValid.value).toBe(false)

      form.setField('title', 'My Title')
      form.setField('description', 'My Description')

      expect(form.isValid.value).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should set field error', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.setFieldError('title', 'Title is required')

      expect(form.getFieldError('title')).toBe('Title is required')
    })

    it('should get field error', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.setFieldError('title', 'Title is required')
      form.setFieldError('email', 'Email is invalid')

      expect(form.getFieldError('title')).toBe('Title is required')
      expect(form.getFieldError('email')).toBe('Email is invalid')
    })

    it('should get all errors', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', email: '' },
      })

      form.setFieldError('title', 'Title is required')
      form.setFieldError('email', 'Email is invalid')

      const errors = form.getErrors()
      expect(errors).toEqual({
        title: 'Title is required',
        email: 'Email is invalid',
      })
    })

    it('should clear field error', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.setFieldError('title', 'Title is required')
      expect(form.getFieldError('title')).toBe('Title is required')

      form.clearFieldError('title')
      expect(form.getFieldError('title')).toBeUndefined()
    })

    it('should clear all errors', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', email: '' },
      })

      form.setFieldError('title', 'Title is required')
      form.setFieldError('email', 'Email is invalid')

      form.clearErrors()

      expect(form.getErrors()).toEqual({})
    })

    it('should clear error when field value changes', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.setFieldError('title', 'Title is required')
      expect(form.getFieldError('title')).toBe('Title is required')

      form.setField('title', 'New Title')
      expect(form.getFieldError('title')).toBeUndefined()
    })
  })

  describe('Step Navigation', () => {
    it('should navigate to next step when valid', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => !!data.description || 'Description is required',
        },
        totalSteps: 2,
      })

      expect(form.currentStep.value).toBe(1)

      // Try to go to next step (should fail - step 1 invalid)
      expect(form.nextStep()).toBe(false)
      expect(form.currentStep.value).toBe(1)

      // Fix step 1 and try again
      form.setField('title', 'My Title')
      expect(form.nextStep()).toBe(true)
      expect(form.currentStep.value).toBe(2)
    })

    it('should navigate to previous step', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        totalSteps: 3,
      })

      form.currentStep.value = 3

      expect(form.previousStep()).toBe(true)
      expect(form.currentStep.value).toBe(2)

      expect(form.previousStep()).toBe(true)
      expect(form.currentStep.value).toBe(1)

      // Can't go back from step 1
      expect(form.previousStep()).toBe(false)
      expect(form.currentStep.value).toBe(1)
    })

    it('should go to specific step', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        totalSteps: 5,
      })

      expect(form.goToStep(3)).toBe(true)
      expect(form.currentStep.value).toBe(3)

      expect(form.goToStep(5)).toBe(true)
      expect(form.currentStep.value).toBe(5)

      // Invalid steps
      expect(form.goToStep(0)).toBe(false)
      expect(form.goToStep(6)).toBe(false)
    })

    it('should not navigate past last step', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        stepValidators: {
          1: () => true,
        },
        totalSteps: 2,
      })

      form.setField('title', 'My Title')
      form.nextStep() // Go to step 2

      expect(form.nextStep()).toBe(false) // Can't go further
      expect(form.currentStep.value).toBe(2)
    })
  })

  describe('Form Reset and Clear', () => {
    it('should reset form to initial values', () => {
      const initialValues = {
        title: '',
        description: '',
        count: 0,
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      form.setField('title', 'New Title')
      form.setField('description', 'New Description')
      form.setField('count', 42)
      form.setFieldError('title', 'Some error')
      form.currentStep.value = 3

      form.reset()

      expect(form.getFormData()).toEqual(initialValues)
      expect(form.getErrors()).toEqual({})
      expect(form.currentStep.value).toBe(1)
      expect(form.isFieldTouched('title')).toBe(false)
    })

    it('should clear form and storage', () => {
      const initialValues = {
        title: '',
        description: '',
      }

      const form = useForm({
        formId: 'test-form',
        initialValues,
      })

      form.setField('title', 'New Title')
      form.saveToStorage()

      // Verify data is in storage
      const stored = localStorageMock.getItem('form_test-form')
      expect(stored).toBeTruthy()

      form.clear()

      // Verify form is reset
      expect(form.getFormData()).toEqual(initialValues)
      expect(form.getErrors()).toEqual({})
      expect(form.currentStep.value).toBe(1)

      // Verify storage is cleared
      const storedAfterClear = localStorageMock.getItem('form_test-form')
      expect(storedAfterClear).toBeNull()
    })
  })

  describe('localStorage Persistence', () => {
    it('should save form data to localStorage', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        persistToStorage: true,
      })

      form.setField('title', 'Saved Title')
      form.setField('description', 'Saved Description')
      form.currentStep.value = 2

      form.saveToStorage()

      const stored = localStorageMock.getItem('form_test-form')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.formData.title).toBe('Saved Title')
      expect(parsed.formData.description).toBe('Saved Description')
      expect(parsed.currentStep).toBe(2)
    })

    it('should load form data from localStorage', () => {
      // First, save some data
      const form1 = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
      })

      form1.setField('title', 'Loaded Title')
      form1.setField('description', 'Loaded Description')
      form1.currentStep.value = 3
      form1.saveToStorage()

      // Create new form instance (simulating page reload)
      const form2 = useForm({
        formId: 'test-form',
        initialValues: { title: '', description: '' },
        totalSteps: 5, // Must match or exceed the saved step
      })

      expect(form2.getField('title')).toBe('Loaded Title')
      expect(form2.getField('description')).toBe('Loaded Description')
      expect(form2.currentStep.value).toBe(3)
    })

    it('should exclude specified fields from storage', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: {
          title: '',
          file: undefined as File | undefined,
        },
        excludeFromStorage: ['file'],
      })

      // Create a mock File object
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })

      form.setField('title', 'My Title')
      form.setField('file', mockFile)
      form.saveToStorage()

      const stored = localStorageMock.getItem('form_test-form')
      const parsed = JSON.parse(stored!)

      expect(parsed.formData.title).toBe('My Title')
      expect(parsed.formData.file).toBeUndefined()
    })

    it('should auto-save on form changes', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        persistToStorage: true,
      })

      form.setField('title', 'Auto-saved Title')

      // Wait for next tick (Vue reactivity)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const stored = localStorageMock.getItem('form_test-form')
          expect(stored).toBeTruthy()

          const parsed = JSON.parse(stored!)
          expect(parsed.formData.title).toBe('Auto-saved Title')
          resolve()
        }, 10)
      })
    })

    it('should not persist when persistToStorage is false', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
        persistToStorage: false,
      })

      form.setField('title', 'Should not save')
      form.saveToStorage()

      const stored = localStorageMock.getItem('form_test-form')
      expect(stored).toBeNull()
    })

    it('should clear storage', () => {
      const form = useForm({
        formId: 'test-form',
        initialValues: { title: '' },
      })

      form.setField('title', 'Test Title')
      form.saveToStorage()

      expect(localStorageMock.getItem('form_test-form')).toBeTruthy()

      form.clearStorage()

      expect(localStorageMock.getItem('form_test-form')).toBeNull()
    })
  })

  describe('Full Flow Integration', () => {
    it('should complete full form flow: initialize -> set fields -> validate -> complete -> clear', () => {
      // Step 1: Initialize form
      const initialValues = {
        title: '',
        description: '',
        email: '',
        age: 0,
      }

      const form = useForm({
        formId: 'full-flow-test',
        initialValues,
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => !!data.description || 'Description is required',
          3: (data) => !!data.email || 'Email is required',
        },
        totalSteps: 3,
      })

      expect(form.getFormData()).toEqual(initialValues)
      expect(form.currentStep.value).toBe(1)

      // Step 2: Set field values
      form.setField('title', 'My Job Title')
      form.setField('description', 'My Job Description')
      form.setField('email', 'test@example.com')
      form.setField('age', 25)

      expect(form.getField('title')).toBe('My Job Title')
      expect(form.getField('description')).toBe('My Job Description')
      expect(form.getField('email')).toBe('test@example.com')
      expect(form.getField('age')).toBe(25)

      // Step 3: Navigate through steps with validation
      // Step 1 should be valid now
      expect(form.validateStep(1)).toBe(true)
      expect(form.nextStep()).toBe(true)
      expect(form.currentStep.value).toBe(2)

      // Step 2 should be valid
      expect(form.validateStep(2)).toBe(true)
      expect(form.nextStep()).toBe(true)
      expect(form.currentStep.value).toBe(3)

      // Step 3 should be valid
      expect(form.validateStep(3)).toBe(true)

      // Step 4: Verify all steps are valid
      expect(form.validateAll()).toBe(true)
      expect(form.isValid.value).toBe(true)

      // Step 5: Verify data is persisted
      form.saveToStorage()
      const stored = localStorageMock.getItem('form_full-flow-test')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.formData.title).toBe('My Job Title')
      expect(parsed.formData.email).toBe('test@example.com')
      expect(parsed.currentStep).toBe(3)

      // Step 6: Clear form (simulating completion)
      form.clear()

      expect(form.getFormData()).toEqual(initialValues)
      expect(form.currentStep.value).toBe(1)
      expect(form.getErrors()).toEqual({})
      expect(localStorageMock.getItem('form_full-flow-test')).toBeNull()
    })

    it('should handle form with errors and fix them', () => {
      const form = useForm({
        formId: 'error-flow-test',
        initialValues: { title: '', email: '' },
        stepValidators: {
          1: (data) => !!data.title || 'Title is required',
          2: (data) => {
            if (!data.email) return 'Email is required'
            if (!data.email.includes('@')) return 'Email must be valid'
            return true
          },
        },
        totalSteps: 2,
      })

      // Try to proceed with invalid data
      expect(form.nextStep()).toBe(false)
      expect(form.getFieldError('step_1')).toBe('Title is required')

      // Fix the error
      form.setField('title', 'My Title')
      expect(form.validateStep(1)).toBe(true)
      expect(form.nextStep()).toBe(true)
      expect(form.currentStep.value).toBe(2)

      // Try to proceed with invalid email
      expect(form.nextStep()).toBe(false)
      expect(form.getFieldError('step_2')).toBe('Email is required')

      // Fix with invalid format
      form.setField('email', 'invalid-email')
      expect(form.validateStep(2)).toBe(false)
      expect(form.getFieldError('step_2')).toBe('Email must be valid')

      // Fix with valid email
      form.setField('email', 'valid@example.com')
      expect(form.validateStep(2)).toBe(true)
      expect(form.isValid.value).toBe(true)
    })

    it('should persist and restore complex nested data', () => {
      const initialValues = {
        user: {
          name: '',
          contact: {
            email: '',
            phone: '',
          },
        },
        preferences: {
          theme: 'light',
          notifications: false,
        },
        tags: [] as string[],
      }

      const form = useForm({
        formId: 'nested-data-test',
        initialValues,
      })

      // Set nested values
      form.setField('user', {
        name: 'John Doe',
        contact: {
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      })
      form.setField('preferences', {
        theme: 'dark',
        notifications: true,
      })
      form.setField('tags', ['tag1', 'tag2', 'tag3'])

      form.saveToStorage()

      // Create new form instance
      const form2 = useForm({
        formId: 'nested-data-test',
        initialValues,
      })

      const user = form2.getField('user')
      expect(user.name).toBe('John Doe')
      expect(user.contact.email).toBe('john@example.com')
      expect(user.contact.phone).toBe('123-456-7890')

      const preferences = form2.getField('preferences')
      expect(preferences.theme).toBe('dark')
      expect(preferences.notifications).toBe(true)

      const tags = form2.getField('tags')
      expect(tags).toEqual(['tag1', 'tag2', 'tag3'])
    })
  })
})
