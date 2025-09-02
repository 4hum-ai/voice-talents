<template>
  <div class="space-y-2">
    <label v-if="label" class="text-foreground block text-sm font-medium">{{ label }}</label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :readonly="readonly"
      class="bg-muted/30 focus:ring-primary/20 focus:border-primary w-full resize-none rounded-md border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none"
      :class="[
        readonly ? 'cursor-not-allowed opacity-70' : 'cursor-text',
        error
          ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
          : 'border-input',
      ]"
      @input="handleInput"
      @blur="handleBlur"
    />
    <p v-if="error" class="text-destructive text-xs">{{ error }}</p>
    <p v-else-if="hint" class="text-muted-foreground text-xs">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** The JSON string value */
  modelValue: string
  /** Label for the input */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Number of rows to display */
  rows?: number
  /** Whether the input is readonly */
  readonly?: boolean
  /** Error message to display */
  error?: string
  /** Hint text to display below the input */
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}

withDefaults(defineProps<Props>(), {
  rows: 8,
  readonly: false,
  placeholder: 'Enter JSON...',
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>
