<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 grid place-items-center bg-black/40"
    role="dialog"
    aria-modal="true"
    @click.self="handleClose"
  >
    <div :class="['border-border bg-card w-full rounded-lg border shadow-xl', sizeClasses]">
      <!-- Header -->
      <div
        v-if="title || $slots.header"
        class="border-border flex items-center justify-between border-b px-6 py-4"
      >
        <slot name="header">
          <h2 v-if="title" class="text-foreground text-lg font-semibold">{{ title }}</h2>
        </slot>
        <Button
          v-if="showCloseButton"
          variant="ghost"
          size="sm"
          icon="mdi:close"
          aria-label="Close"
          @click="handleClose"
        />
      </div>

      <!-- Content -->
      <div class="p-6">
        <slot name="content" />
      </div>

      <!-- Footer -->
      <div
        v-if="$slots.footer"
        class="border-border flex items-center justify-end gap-3 border-t px-6 py-4"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/atoms/Button.vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showCloseButton: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    default:
      return 'max-w-lg'
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
