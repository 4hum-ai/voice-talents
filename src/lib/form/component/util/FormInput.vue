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
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
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

      <!-- Password toggle for password type -->
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        @click="togglePassword"
      >
        <IconEye v-if="!showPassword" class="text-muted-foreground hover:text-foreground h-4 w-4" />
        <IconEyeOff v-else class="text-muted-foreground hover:text-foreground h-4 w-4" />
      </button>
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
import { computed, ref, type Component } from 'vue'
import IconEye from '~icons/mdi/eye'
import IconEyeOff from '~icons/mdi/eye-off'
import {
  generateInputId,
  getValidationState,
  getLabelClasses,
  getHelpTextClasses,
  getErrorClasses,
  getBorderClasses,
  getInputSizeClasses,
  type BaseFormInputProps,
} from './BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: string
  /** Input type */
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
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  showPasswordToggle: true,
  validationState: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = generateInputId('input')
const showPassword = ref(false)

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const inputClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed'

  const padding = props.prefixIcon ? 'pl-10' : 'pl-3'
  const paddingRight =
    props.suffixIcon || (props.type === 'password' && props.showPasswordToggle) ? 'pr-10' : 'pr-3'

  return `${base} ${getInputSizeClasses(props.size)} ${padding} ${paddingRight} ${getBorderClasses(effectiveValidationState.value)}`
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

const togglePassword = () => {
  showPassword.value = !showPassword.value
  // Change input type
  const input = document.getElementById(inputId) as HTMLInputElement
  if (input) {
    input.type = showPassword.value ? 'text' : 'password'
  }
}
</script>
