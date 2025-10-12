<template>
  <div class="w-full">
    <label v-if="label" :for="textareaId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :class="textareaClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- Help text -->
    <p v-if="helpText" :class="helpTextClasses">
      {{ helpText }}
    </p>

    <!-- Error message -->
    <p v-if="error" :class="errorClasses">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  /** Placeholder text */
  placeholder?: string
  /** Number of rows */
  rows?: number
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field is readonly */
  readonly?: boolean
  /** Help text below the textarea */
  helpText?: string
  /** Error message */
  error?: string
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
  /** Whether to auto-resize based on content */
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'md',
  validationState: 'default',
  autoResize: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`

const textareaClasses = computed(() => {
  const base =
    'w-full rounded-md border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-y'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  let borderClasses = 'border-border focus:border-primary focus:ring-primary'

  if (props.validationState === 'success') {
    borderClasses =
      'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400 dark:focus:ring-green-400'
  } else if (props.validationState === 'error') {
    borderClasses =
      'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400'
  } else if (props.validationState === 'warning') {
    borderClasses =
      'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-600 dark:focus:border-yellow-400 dark:focus:ring-yellow-400'
  }

  const resizeClass = props.autoResize ? 'resize-none' : 'resize-y'

  return `${base} ${sizes[props.size]} ${borderClasses} ${resizeClass}`
})

const labelClasses = computed(() => {
  const base = 'block font-medium text-foreground'
  const sizes = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-base mb-2',
  }
  return `${base} ${sizes[props.size]}`
})

const helpTextClasses = computed(() => {
  const base = 'mt-1 text-muted-foreground'
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

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  // Auto-resize functionality
  if (props.autoResize) {
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
