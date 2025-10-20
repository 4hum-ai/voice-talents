<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-for="field in fields" :key="field.name" class="space-y-2">
      <!-- Field Label -->
      <label
        v-if="field.label"
        :for="field.name"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        :class="{ 'text-red-600 dark:text-red-400': hasError(field.name) }"
      >
        {{ field.label }}
        <span v-if="field.required" class="ml-1 text-red-500">*</span>
      </label>

      <!-- Field Description -->
      <p v-if="field.description" class="text-sm text-gray-500 dark:text-gray-400">
        {{ field.description }}
      </p>

      <!-- Text Input -->
      <input
        v-if="
          field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password' ||
          field.type === 'url'
        "
        :id="field.name"
        :type="field.type"
        :name="field.name"
        :value="getFieldValue(field.name)"
        :placeholder="field.placeholder"
        :required="field.required"
        :disabled="field.disabled"
        :class="inputClasses(field)"
        @input="updateField(field.name, ($event.target as HTMLInputElement).value)"
        @blur="validateField(field.name)"
      />

      <!-- Textarea -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        :name="field.name"
        :value="getFieldValue(field.name)"
        :placeholder="field.placeholder"
        :required="field.required"
        :disabled="field.disabled"
        :rows="field.rows || 4"
        :class="inputClasses(field)"
        @input="updateField(field.name, ($event.target as HTMLTextAreaElement).value)"
        @blur="validateField(field.name)"
      />

      <!-- Select -->
      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        :name="field.name"
        :value="getFieldValue(field.name)"
        :required="field.required"
        :disabled="field.disabled"
        :class="inputClasses(field)"
        @change="updateField(field.name, ($event.target as HTMLSelectElement).value)"
        @blur="validateField(field.name)"
      >
        <option v-if="field.placeholder" value="">{{ field.placeholder }}</option>
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Multi-Select -->
      <div v-else-if="field.type === 'multiselect'" class="space-y-2">
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="option in field.options"
            :key="option.value"
            :variant="isSelected(field.name, option.value) ? 'primary' : 'outline'"
            size="sm"
            @click="toggleSelection(field.name, option.value)"
            class="cursor-pointer"
          >
            {{ option.label }}
          </Chip>
        </div>
      </div>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" class="flex items-center space-x-3">
        <input
          :id="field.name"
          :name="field.name"
          type="checkbox"
          :checked="getFieldValue(field.name)"
          :required="field.required"
          :disabled="field.disabled"
          :class="checkboxClasses(field)"
          @change="updateField(field.name, ($event.target as HTMLInputElement).checked)"
        />
        <label :for="field.name" class="text-sm text-gray-700 dark:text-gray-300">
          {{ field.label }}
        </label>
      </div>

      <!-- Radio Group -->
      <div v-else-if="field.type === 'radio'" class="space-y-2">
        <div
          v-for="option in field.options"
          :key="option.value"
          class="flex items-center space-x-3"
        >
          <input
            :id="`${field.name}-${option.value}`"
            :name="field.name"
            type="radio"
            :value="option.value"
            :checked="getFieldValue(field.name) === option.value"
            :required="field.required"
            :disabled="field.disabled"
            :class="radioClasses(field)"
            @change="updateField(field.name, option.value)"
          />
          <label
            :for="`${field.name}-${option.value}`"
            class="text-sm text-gray-700 dark:text-gray-300"
          >
            {{ option.label }}
          </label>
        </div>
      </div>

      <!-- File Upload -->
      <div v-else-if="field.type === 'file'" class="space-y-2">
        <div
          class="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
          :class="{ 'border-red-300 dark:border-red-600': hasError(field.name) }"
        >
          <Icon name="mdi:cloud-upload" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {{ field.placeholder || 'Click to upload or drag and drop' }}
          </p>
          <input
            :id="field.name"
            :name="field.name"
            type="file"
            :accept="field.accept"
            :multiple="field.multiple"
            :required="field.required"
            :disabled="field.disabled"
            class="hidden"
            @change="handleFileUpload(field.name, $event)"
          />
          <Button
            variant="outline"
            size="sm"
            @click="triggerFileInput(field.name)"
            :disabled="field.disabled"
          >
            <Icon name="mdi:folder-open" class="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
        <div v-if="field.accept" class="text-xs text-gray-500 dark:text-gray-400">
          Accepted formats: {{ field.accept }}
        </div>
      </div>

      <!-- Date Input -->
      <input
        v-else-if="field.type === 'date'"
        :id="field.name"
        :name="field.name"
        type="date"
        :value="getFieldValue(field.name)"
        :required="field.required"
        :disabled="field.disabled"
        :class="inputClasses(field)"
        @change="updateField(field.name, ($event.target as HTMLInputElement).value)"
        @blur="validateField(field.name)"
      />

      <!-- Number Input -->
      <input
        v-else-if="field.type === 'number'"
        :id="field.name"
        :name="field.name"
        type="number"
        :value="getFieldValue(field.name)"
        :placeholder="field.placeholder"
        :required="field.required"
        :disabled="field.disabled"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :class="inputClasses(field)"
        @input="updateField(field.name, parseFloat(($event.target as HTMLInputElement).value))"
        @blur="validateField(field.name)"
      />

      <!-- Error Message -->
      <p v-if="hasError(field.name)" class="text-sm text-red-600 dark:text-red-400">
        {{ getErrorMessage(field.name) }}
      </p>
    </div>

    <!-- Form Actions -->
    <div
      class="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700"
    >
      <Button v-if="showCancel" variant="outline" @click="handleCancel" :disabled="loading">
        Cancel
      </Button>
      <Button type="submit" variant="primary" :loading="loading" :disabled="!isValid || loading">
        {{ submitText }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import Chip from '@/components/atoms/Chip.vue'

interface FormField {
  name: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'url'
    | 'textarea'
    | 'select'
    | 'multiselect'
    | 'checkbox'
    | 'radio'
    | 'file'
    | 'date'
    | 'number'
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  rows?: number
  accept?: string
  multiple?: boolean
  min?: number
  max?: number
  step?: number
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null
  }
}

interface Props {
  fields: FormField[]
  initialValues?: Record<string, any>
  loading?: boolean
  showCancel?: boolean
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showCancel: true,
  submitText: 'Submit',
})

const emit = defineEmits<{
  submit: [values: Record<string, any>]
  cancel: []
  change: [field: string, value: any]
}>()

// State
const formData = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})

// Initialize form data
Object.keys(props.initialValues || {}).forEach((key) => {
  formData[key] = props.initialValues![key]
})

// Computed
const isValid = computed(() => {
  return (
    Object.keys(errors).length === 0 &&
    props.fields.every((field) => {
      if (field.required && !formData[field.name]) {
        return false
      }
      return true
    })
  )
})

// Methods
const getFieldValue = (name: string) => {
  return formData[name] || ''
}

const updateField = (name: string, value: any) => {
  formData[name] = value
  touched[name] = true
  emit('change', name, value)

  // Clear error when user starts typing
  if (errors[name]) {
    delete errors[name]
  }
}

const validateField = (name: string) => {
  const field = props.fields.find((f) => f.name === name)
  if (!field || !field.validation) return

  const value = formData[name]
  const validation = field.validation

  // Required validation
  if (validation.required && (!value || (typeof value === 'string' && !value.trim()))) {
    errors[name] = `${field.label || name} is required`
    return
  }

  // Skip other validations if value is empty and not required
  if (!value && !validation.required) return

  // Min length validation
  if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
    errors[name] = `${field.label || name} must be at least ${validation.minLength} characters`
    return
  }

  // Max length validation
  if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
    errors[name] = `${field.label || name} must be no more than ${validation.maxLength} characters`
    return
  }

  // Pattern validation
  if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
    errors[name] = `${field.label || name} format is invalid`
    return
  }

  // Custom validation
  if (validation.custom) {
    const customError = validation.custom(value)
    if (customError) {
      errors[name] = customError
      return
    }
  }

  // Clear error if validation passes
  delete errors[name]
}

const hasError = (name: string) => {
  return touched[name] && errors[name]
}

const getErrorMessage = (name: string) => {
  return errors[name] || ''
}

const inputClasses = (field: FormField) => {
  const base =
    'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
  const error = hasError(field.name)
    ? 'border-red-300 dark:border-red-600'
    : 'border-gray-300 dark:border-gray-600'
  const disabled = field.disabled
    ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'

  return `${base} ${error} ${disabled}`
}

const checkboxClasses = (field: FormField) => {
  const base =
    'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
  const error = hasError(field.name) ? 'border-red-300 dark:border-red-600' : ''

  return `${base} ${error}`
}

const radioClasses = (field: FormField) => {
  const base = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
  const error = hasError(field.name) ? 'border-red-300 dark:border-red-600' : ''

  return `${base} ${error}`
}

const isSelected = (name: string, value: string | number) => {
  const selectedValues = formData[name] || []
  return Array.isArray(selectedValues) && selectedValues.includes(value)
}

const toggleSelection = (name: string, value: string | number) => {
  const currentValues = formData[name] || []
  const newValues = Array.isArray(currentValues) ? [...currentValues] : []

  const index = newValues.indexOf(value)
  if (index > -1) {
    newValues.splice(index, 1)
  } else {
    newValues.push(value)
  }

  updateField(name, newValues)
}

const handleFileUpload = (name: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    updateField(name, files[0])
  }
}

const triggerFileInput = (name: string) => {
  const input = document.getElementById(name) as HTMLInputElement
  if (input) {
    input.click()
  }
}

const handleSubmit = () => {
  // Validate all fields
  props.fields.forEach((field) => {
    validateField(field.name)
  })

  if (isValid.value) {
    emit('submit', { ...formData })
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
