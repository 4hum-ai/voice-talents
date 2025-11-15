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
  getHelpTextClasses,
  getErrorClasses,
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface Props extends Omit<BaseFormInputProps, 'size'> {
  modelValue: boolean
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

const checkboxId = generateInputId('checkbox')

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const checkboxClasses = computed(() => {
  const base =
    'rounded border bg-input text-primary focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  let borderClasses = 'border-border focus:ring-primary'

  if (effectiveValidationState.value === 'success') {
    borderClasses = 'border-green-300 focus:ring-green-500 text-green-600 dark:border-green-600'
  } else if (effectiveValidationState.value === 'error') {
    borderClasses = 'border-red-300 focus:ring-red-500 text-red-600 dark:border-red-600'
  } else if (effectiveValidationState.value === 'warning') {
    borderClasses = 'border-yellow-300 focus:ring-yellow-500 text-yellow-600 dark:border-yellow-600'
  }

  return `${base} ${sizes[props.size]} ${borderClasses}`
})

const labelClasses = computed(() => {
  const base = 'font-medium text-foreground cursor-pointer'
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return `${base} ${sizes[props.size]}`
})

const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

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
