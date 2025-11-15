<template>
  <component
    :is="inputComponent"
    v-bind="inputProps"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import TextInput from '../input/TextInput.vue'
import EmailInput from '../input/EmailInput.vue'
import PasswordInput from '../input/PasswordInput.vue'
import NumberInput from '../input/NumberInput.vue'
import DateInput from '../input/DateInput.vue'
import type { BaseFormInputProps } from './BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: string | number
  /** Input type - determines which component to render */
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'tel'
    | 'url'
    | 'search'
  /** Placeholder text */
  placeholder?: string
  /** Whether the field is readonly */
  readonly?: boolean
  /** Prefix icon component */
  prefixIcon?: Component
  /** Suffix icon component */
  suffixIcon?: Component
  /** Whether to show password toggle for password type */
  showPasswordToggle?: boolean
  /** Min value (for number/date inputs) */
  min?: number | string
  /** Max value (for number/date inputs) */
  max?: number | string
  /** Step value (for number inputs) */
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  validationState: 'default',
  showPasswordToggle: true,
  step: 1,
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputComponent = computed<Component>(() => {
  switch (props.type) {
    case 'email':
      return EmailInput
    case 'password':
      return PasswordInput
    case 'number':
      return NumberInput
    case 'date':
    case 'datetime-local':
    case 'time':
      return DateInput
    case 'text':
    case 'tel':
    case 'url':
    case 'search':
    default:
      return TextInput
  }
})

const inputProps = computed(() => {
  const baseProps = {
    modelValue: props.modelValue,
    label: props.label,
    required: props.required,
    disabled: props.disabled,
    helpText: props.helpText,
    error: props.error,
    size: props.size,
    validationState: props.validationState,
    placeholder: props.placeholder,
    readonly: props.readonly,
    prefixIcon: props.prefixIcon,
    suffixIcon: props.suffixIcon,
  }

  // Add type-specific props
  if (props.type === 'password') {
    return { ...baseProps, showPasswordToggle: props.showPasswordToggle }
  }

  if (props.type === 'number') {
    return {
      ...baseProps,
      min: props.min as number | undefined,
      max: props.max as number | undefined,
      step: props.step,
    }
  }

  if (props.type === 'date' || props.type === 'datetime-local' || props.type === 'time') {
    return {
      ...baseProps,
      min: props.min as string | undefined,
      max: props.max as string | undefined,
    }
  }

  return baseProps
})
</script>
