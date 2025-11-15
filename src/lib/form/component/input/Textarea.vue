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

    <!-- Error message (shown first if present) -->
    <p v-if="error" :class="errorClasses">
      {{ error }}
    </p>

    <!-- Help text (shown only if no error) -->
    <p v-if="helpText && !error" :class="helpTextClasses">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  generateInputId,
  getValidationState,
  getLabelClasses,
  getHelpTextClasses,
  getErrorClasses,
  getBorderClasses,
  getInputSizeClasses,
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: string
  /** Placeholder text */
  placeholder?: string
  /** Number of rows */
  rows?: number
  /** Whether the field is readonly */
  readonly?: boolean
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

const textareaId = generateInputId('textarea')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const textareaClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed'

  const resizeClass = props.autoResize ? 'resize-none' : 'resize-y'

  return `${base} ${getInputSizeClasses(props.size)} ${getBorderClasses(effectiveValidationState.value)} ${resizeClass}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

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
