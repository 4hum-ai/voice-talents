<template>
  <div class="w-full">
    <div v-if="label" class="mb-2 flex items-center justify-between">
      <label :for="rangeId" :class="labelClasses">
        {{ label }}
        <span v-if="required" class="ml-1 text-red-500">*</span>
      </label>
      <span v-if="showValue" :class="valueClasses">
        {{ displayValue }}
      </span>
    </div>

    <div class="relative">
      <input
        :id="rangeId"
        v-model.number="localValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :required="required"
        :disabled="disabled"
        :class="rangeClasses"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div v-if="showLabels" class="text-muted-foreground mt-1 flex justify-between text-xs">
        <span>{{ minLabel || min }}</span>
        <span>{{ maxLabel || max }}</span>
      </div>
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
import { computed, ref, watch } from 'vue'
import {
  generateInputId,
  getValidationState,
  getLabelClasses,
  getHelpTextClasses,
  getErrorClasses,
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: number
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step value */
  step?: number
  /** Show current value */
  showValue?: boolean
  /** Show min/max labels */
  showLabels?: boolean
  /** Custom min label */
  minLabel?: string
  /** Custom max label */
  maxLabel?: string
  /** Value formatter function */
  formatter?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
  step: 1,
  showValue: true,
  showLabels: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  input: [event: Event]
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const rangeId = generateInputId('range')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
)

const valueClasses = computed(() => {
  const base = 'font-medium text-foreground'
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return `${base} ${sizes[props.size]}`
})

const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter(localValue.value)
  }
  return localValue.value
})

const rangeClasses = computed(() => {
  const base =
    'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  let accentClasses = 'accent-primary'

  if (effectiveValidationState.value === 'success') {
    accentClasses = 'accent-green-500'
  } else if (effectiveValidationState.value === 'error') {
    accentClasses = 'accent-red-500'
  } else if (effectiveValidationState.value === 'warning') {
    accentClasses = 'accent-yellow-500'
  }

  return `${base} ${accentClasses}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  localValue.value = value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
