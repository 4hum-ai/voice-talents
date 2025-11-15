<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :required="required"
        :disabled="disabled"
        :multiple="true"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option
          v-for="option in options"
          :key="String(option.value)"
          :value="String(option.value)"
          :selected="modelValue.includes(option.value)"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Selected count indicator -->
      <div
        v-if="selectedCount > 0"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <span class="text-muted-foreground text-xs">{{ selectedCount }} selected</span>
      </div>
    </div>

    <!-- Selected items display (optional, for better UX) -->
    <div v-if="selectedItems.length > 0 && showSelectedTags" class="mt-2 flex flex-wrap gap-2">
      <span
        v-for="item in selectedItems"
        :key="String(item.value)"
        class="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
      >
        {{ item.label }}
        <button
          type="button"
          class="hover:text-primary/80 text-primary/60"
          @click="removeItem(item.value)"
        >
          <IconClose class="h-3 w-3" />
        </button>
      </span>
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
import IconClose from '~icons/mdi/close'
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
  disabled?: boolean
}

interface Props extends BaseFormInputProps {
  modelValue: (string | number | boolean)[]
  /** Select options */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Maximum number of selections */
  maxSelections?: number
  /** Show selected items as tags */
  showSelectedTags?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
  showSelectedTags: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number | boolean)[]]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = generateInputId('multiselect')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const selectClasses = computed(() => {
  const base =
    'w-full rounded-md bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-20 min-h-[42px]'

  return `${base} ${getInputSizeClasses(props.size, true)} ${getBorderClasses(effectiveValidationState.value)}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const selectedCount = computed(() => props.modelValue.length)

const selectedItems = computed(() => {
  return props.options.filter((opt) => props.modelValue.includes(opt.value))
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedValues: (string | number | boolean)[] = []

  // Get all selected options
  for (let i = 0; i < target.options.length; i++) {
    const option = target.options[i]
    if (option.selected) {
      const optionValue = props.options.find((opt) => String(opt.value) === option.value)
      if (optionValue) {
        selectedValues.push(optionValue.value)
      }
    }
  }

  // Check max selections
  if (props.maxSelections && selectedValues.length > props.maxSelections) {
    // Keep only the first maxSelections items
    selectedValues.splice(props.maxSelections)
  }

  emit('update:modelValue', selectedValues)
}

const removeItem = (value: string | number | boolean) => {
  const newValue = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', newValue)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
