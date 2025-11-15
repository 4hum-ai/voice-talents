<template>
  <div class="w-full">
    <label v-if="label" :for="fromId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="flex-1">
        <label :for="fromId" class="text-muted-foreground mb-1 block text-xs sm:text-sm"
          >From</label
        >
        <input
          :id="fromId"
          type="date"
          :value="from"
          :required="required"
          :disabled="disabled"
          :class="inputClasses"
          :max="to"
          @change="handleFromChange"
        />
      </div>
      <div class="flex-1">
        <label :for="toId" class="text-muted-foreground mb-1 block text-xs sm:text-sm">To</label>
        <input
          :id="toId"
          type="date"
          :value="to"
          :required="required"
          :disabled="disabled"
          :class="inputClasses"
          :min="from"
          @change="handleToChange"
        />
      </div>
    </div>

    <!-- Error message (shown first if present) -->
    <p v-if="effectiveError" :class="errorClasses">
      {{ effectiveError }}
    </p>

    <!-- Help text (shown only if no error) -->
    <p v-if="helpText && !effectiveError" :class="helpTextClasses">
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
  from?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{
  'update:from': [value: string]
  'update:to': [value: string]
}>()

const fromId = generateInputId('date-from')
const toId = generateInputId('date-to')

// Validate that from date is not greater than to date
const rangeError = computed(() => {
  if (props.from && props.to) {
    const fromDate = new Date(props.from)
    const toDate = new Date(props.to)
    if (fromDate > toDate) {
      return 'From date must be before or equal to To date'
    }
  }
  return undefined
})

// Combine external error with internal range validation error
const effectiveError = computed(() => {
  return props.error || rangeError.value
})

const effectiveValidationState = computed(() =>
  getValidationState(effectiveError.value, props.validationState),
)

const inputClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed'

  return `${base} ${getInputSizeClasses(props.size, true)} ${getBorderClasses(effectiveValidationState.value)}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

// Handle date changes
const handleFromChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:from', value)
}

const handleToChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:to', value)
}
</script>
