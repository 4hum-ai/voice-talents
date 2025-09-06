<template>
  <div class="w-full">
    <div class="flex items-start">
      <div class="flex h-5 items-center">
        <input
          :id="checkboxId"
          v-model="checked"
          type="checkbox"
          :required="required"
          :disabled="disabled"
          :class="checkboxClasses"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>
      <div class="ml-3 text-sm">
        <label :for="checkboxId" :class="labelClasses">
          {{ label }}
          <span v-if="required" class="ml-1 text-red-500">*</span>
        </label>
        <!-- Help text -->
        <p v-if="helpText" :class="helpTextClasses">
          {{ helpText }}
        </p>
        <!-- Error message -->
        <p v-if="error" :class="errorClasses">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Help text below the checkbox */
  helpText?: string
  /** Error message */
  error?: string
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const checkboxClasses = computed(() => {
  const base =
    'rounded border-gray-300 bg-white text-red-600 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800'

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  let focusClasses = 'focus:ring-2 focus:ring-offset-0'

  if (props.validationState === 'success') {
    focusClasses = 'focus:ring-green-500 text-green-600'
  } else if (props.validationState === 'error') {
    focusClasses = 'focus:ring-red-500 text-red-600 border-red-300'
  } else if (props.validationState === 'warning') {
    focusClasses = 'focus:ring-yellow-500 text-yellow-600 border-yellow-300'
  }

  return `${base} ${sizes[props.size]} ${focusClasses}`
})

const labelClasses = computed(() => {
  const base = 'font-medium text-gray-700 dark:text-gray-300 cursor-pointer'
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return `${base} ${sizes[props.size]}`
})

const helpTextClasses = computed(() => {
  const base = 'mt-1 text-gray-500 dark:text-gray-400'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[props.size]}`
})

const errorClasses = computed(() => {
  const base = 'mt-1 text-red-600 dark:text-red-400'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[props.size]}`
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
