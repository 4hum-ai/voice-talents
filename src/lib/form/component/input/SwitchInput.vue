<template>
  <div class="w-full">
    <div class="flex items-start">
      <div class="flex items-center">
        <button
          :id="switchId"
          type="button"
          role="switch"
          :aria-checked="modelValue"
          :aria-label="label || 'Toggle switch'"
          :disabled="disabled"
          :class="switchClasses"
          @click="toggle"
          @blur="handleBlur"
          @focus="handleFocus"
        >
          <span :class="thumbClasses" />
        </button>
      </div>
      <div v-if="label" class="ml-3 flex-1">
        <label :for="switchId" :class="labelClasses">
          {{ label }}
          <span v-if="required" class="ml-1 text-red-500">*</span>
        </label>
        <!-- Error message (shown first if present) -->
        <p v-if="error" :class="errorClasses">
          {{ error }}
        </p>
        <!-- Help text (shown only if no error) -->
        <p v-if="helpText && !error" :class="helpTextClasses">
          {{ helpText }}
        </p>
      </div>
    </div>
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

interface Props extends Omit<BaseFormInputProps, 'size'> {
  modelValue: boolean
  /** Switch size */
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

const switchId = generateInputId('switch')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const switchClasses = computed(() => {
  const base =
    'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  }

  let bgClasses = props.modelValue
    ? 'bg-primary focus:ring-primary'
    : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'

  if (effectiveValidationState.value === 'success') {
    bgClasses = props.modelValue
      ? 'bg-green-500 focus:ring-green-500'
      : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'
  } else if (effectiveValidationState.value === 'error') {
    bgClasses = props.modelValue
      ? 'bg-red-500 focus:ring-red-500'
      : 'bg-gray-300 dark:bg-gray-600 focus:ring-red-400'
  } else if (effectiveValidationState.value === 'warning') {
    bgClasses = props.modelValue
      ? 'bg-yellow-500 focus:ring-yellow-500'
      : 'bg-gray-300 dark:bg-gray-600 focus:ring-yellow-400'
  }

  return `${base} ${sizes[props.size]} ${bgClasses}`
})

const thumbClasses = computed(() => {
  const base =
    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out'

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const translateClasses = {
    sm: props.modelValue ? 'translate-x-4' : 'translate-x-0',
    md: props.modelValue ? 'translate-x-5' : 'translate-x-0',
    lg: props.modelValue ? 'translate-x-7' : 'translate-x-0',
  }

  return `${base} ${sizes[props.size]} ${translateClasses[props.size]}`
})

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
