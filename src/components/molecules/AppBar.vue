<template>
  <div
    class="fixed relative inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex min-w-0 items-center gap-3">
        <IconButton v-if="showBack" aria-label="Go back" @click="$emit('back')">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.78 15.53a.75.75 0 01-1.06 0l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 111.06 1.06L8.31 10l4.47 4.47a.75.75 0 010 1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </IconButton>
        <div v-if="hasLeftSlot" class="min-w-0">
          <slot name="left" />
        </div>
        <div v-else class="min-w-0">
          <div class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            <slot name="title" />
          </div>
          <div class="truncate text-xs text-gray-500 dark:text-gray-400">
            <slot name="subtitle" />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import IconButton from '@/components/atoms/IconButton.vue'

interface Props {
  loading?: boolean
  showBack?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showBack: false,
})

defineEmits(['back'])

const slots = useSlots()
const hasLeftSlot = computed(() => Boolean(slots.left))
</script>

<style scoped></style>
