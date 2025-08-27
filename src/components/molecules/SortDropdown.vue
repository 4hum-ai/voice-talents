<template>
  <div class="inline-flex items-center gap-2">
    <span v-if="label" class="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">{{ label }}</span>
    <div class="relative">
      <select
        :id="id"
        :name="name"
        :value="modelValue"
        :disabled="disabled"
        :aria-label="!label ? ariaLabel : undefined"
        :title="selectedLabel"
        @change="onChange"
        :class="[
          'px-2 py-1.5 text-xs rounded-md border bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 appearance-none pr-8',
          'border-gray-300 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-600'
        ]"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.key" :value="opt.key">
          {{ opt.key === modelValue ? '✓ ' + opt.label : opt.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Option = { key: string; label: string }

const props = defineProps<{
  options: Option[]
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedLabel = computed(() => props.options.find(o => o.key === props.modelValue)?.label ?? '')

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)
}
</script>


