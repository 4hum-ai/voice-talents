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
import { computed, ref, type Component } from 'vue'
import IconEye from '~icons/mdi/eye'
import IconEyeOff from '~icons/mdi/eye-off'

interface Props {
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
  /** Help text below the input */
  helpText?: string
  /** Error message */
  error?: string
  /** Prefix icon component */
  prefixIcon?: Component
  /** Suffix icon component */
  suffixIcon?: Component
  /** Whether to show password toggle for password type */
  showPasswordToggle?: boolean
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
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

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const showPassword = ref(false)

const inputClasses = computed(() => {
  const base =
    'w-full rounded-md border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const padding = props.prefixIcon ? 'pl-10' : 'pl-3'
  const paddingRight =
    props.suffixIcon || (props.type === 'password' && props.showPasswordToggle) ? 'pr-10' : 'pr-3'

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

  return `${base} ${sizes[props.size]} ${padding} ${paddingRight} ${borderClasses}`
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
