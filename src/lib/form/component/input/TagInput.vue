<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div :class="containerClasses">
      <button
        v-for="(t, i) in modelValue"
        :key="t + i"
        type="button"
        class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        :title="`Remove ${t}`"
        @click="remove(i)"
      >
        <span>{{ t }}</span>
        <span aria-hidden="true">✕</span>
      </button>
      <input
        :id="inputId"
        v-model="local"
        type="text"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="min-w-[120px] flex-1 bg-transparent text-sm text-gray-900 outline-none sm:min-w-[160px] dark:text-gray-100"
        @keydown.enter.prevent="commit"
        @keydown="onKeydown"
        @blur="commit"
      />
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
  getBorderClasses,
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: string[]
  /** Placeholder text */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Add tag and press Enter',
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

const inputId = generateInputId('tag-input')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const containerClasses = computed(() => {
  const base =
    'flex flex-wrap items-center gap-2 rounded-md border px-2 py-2 transition-colors bg-input'

  return `${base} ${getBorderClasses(effectiveValidationState.value)}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const local = ref('')

function commit() {
  const val = local.value.trim()
  if (!val) return
  if (!props.modelValue.includes(val)) emit('update:modelValue', [...props.modelValue, val])
  local.value = ''
}
function remove(index: number) {
  const next = props.modelValue.slice()
  next.splice(index, 1)
  emit('update:modelValue', next)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === ',') {
    e.preventDefault()
    commit()
  }
}

// ensure local clears if parent resets tags
watch(
  () => props.modelValue.length,
  () => {
    if (!props.modelValue.length) local.value = ''
  },
)
</script>
