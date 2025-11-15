<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Icon prefix -->
      <div
        v-if="prefixIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <component :is="prefixIcon" class="text-muted-foreground h-4 w-4" />
      </div>

      <input
        :id="inputId"
        type="date"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Icon suffix -->
      <div
        v-if="suffixIcon"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <component :is="suffixIcon" class="text-muted-foreground h-4 w-4" />
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
import { computed, type Component } from 'vue'
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
  /** Whether the field is readonly */
  readonly?: boolean
  /** Minimum date (YYYY-MM-DD) */
  min?: string
  /** Maximum date (YYYY-MM-DD) */
  max?: string
  /** Prefix icon component */
  prefixIcon?: Component
  /** Suffix icon component */
  suffixIcon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = generateInputId('date-input')
const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const inputClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed'

  const padding = props.prefixIcon ? 'pl-10' : 'pl-3'
  const paddingRight = props.suffixIcon ? 'pr-10' : 'pr-3'

  return `${base} ${getInputSizeClasses(props.size, true)} ${padding} ${paddingRight} ${getBorderClasses(effectiveValidationState.value)}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
