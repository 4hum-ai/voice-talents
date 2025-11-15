<template>
  <div class="w-full">
    <label v-if="label" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div :class="containerClasses">
      <label
        v-for="option in options"
        :key="String(option.value)"
        :for="`${radioId}-${String(option.value)}`"
        :class="radioLabelClasses"
      >
        <input
          :id="`${radioId}-${String(option.value)}`"
          :checked="modelValue === option.value"
          :value="option.value"
          :name="radioId"
          type="radio"
          :required="required"
          :disabled="disabled || option.disabled"
          :class="radioClasses"
          @change="handleChange(option.value)"
          @blur="handleBlur"
          @focus="handleFocus"
        />
        <span :class="optionLabelClasses">{{ option.label }}</span>
      </label>
    </div>

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
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface RadioOption {
  value: string | number | boolean
  label: string
  disabled?: boolean
}

interface Props extends BaseFormInputProps {
  modelValue: string | number | boolean | undefined
  /** Radio options */
  options: RadioOption[]
  /** Horizontal layout (default: false = vertical) */
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
  inline: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const radioId = generateInputId('radio')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const containerClasses = computed(() => {
  const base = 'space-y-2'
  return props.inline ? `${base} flex flex-wrap gap-4` : base
})

const radioLabelClasses = computed(() => {
  const base = 'flex items-center cursor-pointer'
  return props.inline ? base : `${base} w-full`
})

const radioClasses = computed(() => {
  const base =
    'text-primary focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  let ringClasses = 'focus:ring-primary'

  if (effectiveValidationState.value === 'success') {
    ringClasses = 'focus:ring-green-500 text-green-600'
  } else if (effectiveValidationState.value === 'error') {
    ringClasses = 'focus:ring-red-500 text-red-600'
  } else if (effectiveValidationState.value === 'warning') {
    ringClasses = 'focus:ring-yellow-500 text-yellow-600'
  }

  return `${base} ${sizes[props.size]} ${ringClasses}`
})

const optionLabelClasses = computed(() => {
  const base = 'font-medium text-foreground ml-2'
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return `${base} ${sizes[props.size]}`
})

const handleChange = (value: string | number | boolean) => {
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
