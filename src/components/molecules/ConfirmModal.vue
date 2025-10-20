<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div class="border-border bg-card w-full max-w-sm rounded-lg border p-4 shadow-xl">
      <h3 class="text-foreground text-base font-semibold">
        {{ title }}
      </h3>
      <p class="text-muted-foreground mt-2 text-sm">
        {{ message }}
      </p>

      <!-- Text confirmation input when required -->
      <div v-if="confirmationText" class="mt-4">
        <label class="text-foreground block text-sm font-medium">
          Type
          <span class="font-mono font-semibold text-red-600 dark:text-red-400">{{
            confirmationText
          }}</span>
          to confirm:
        </label>
        <input
          v-model="inputText"
          type="text"
          class="border-border bg-input text-foreground placeholder-muted-foreground mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          :placeholder="`Type ${confirmationText} to confirm`"
          @keyup.enter="handleConfirm"
        />
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" @click="$emit('cancel')">
          {{ cancelLabel || 'Cancel' }}
        </Button>
        <Button
          :disabled="!isConfirmEnabled"
          :variant="isConfirmEnabled ? 'danger' : 'default'"
          size="sm"
          @click="handleConfirm"
        >
          {{ confirmLabel || 'Confirm' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmationText?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const inputText = ref('')

// Computed property to check if confirm button should be enabled
const isConfirmEnabled = computed(() => {
  if (!props.confirmationText) {
    return true // No text confirmation required
  }
  return inputText.value === props.confirmationText
})

// Handle confirm action
const handleConfirm = () => {
  if (isConfirmEnabled.value) {
    emit('confirm')
  }
}

// Reset input when modal opens/closes
const resetInput = () => {
  inputText.value = ''
}

// Watch for modal open/close to reset input
import { watch } from 'vue'
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetInput()
    }
  },
)
</script>
