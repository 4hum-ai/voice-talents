<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option :value="undefined">
          {{ placeholder || `Select ${label?.toLowerCase() || 'option'}` }}
        </option>
        <option v-for="option in options" :key="String(option.value)" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Dropdown arrow icon -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <IconChevronDown class="h-4 w-4 text-gray-400 dark:text-gray-500" />
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
import { computed } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'
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

interface SelectOption {
  value: string | number | boolean
  label: string
}

interface Props extends BaseFormInputProps {
  modelValue: string | number | boolean | undefined
  /** Select options */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = generateInputId('select')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const selectClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10'

  return `${base} ${getInputSizeClasses(props.size, true)} ${getBorderClasses(effectiveValidationState.value)}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  // Convert to appropriate type based on the option value
  const selectedOption = props.options.find((opt) => String(opt.value) === value)
  emit('update:modelValue', selectedOption?.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
