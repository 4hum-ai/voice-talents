<template>
  <div
    :class="[
      'border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80',
      fixed ? 'fixed inset-x-0 top-0 z-40' : 'relative',
    ]"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex min-w-0 items-center gap-3">
        <IconButton v-if="showBack" aria-label="Go back" @click="$emit('back')">
          <ChevronLeftIcon class="h-5 w-5" />
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
import ChevronLeftIcon from '~icons/mdi/chevron-left'

interface Props {
  loading?: boolean
  showBack?: boolean
  /** Whether the AppBar should be fixed at the top of the viewport */
  fixed?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showBack: false,
  fixed: true,
})

defineEmits(['back'])

const slots = useSlots()
const hasLeftSlot = computed(() => Boolean(slots.left))
</script>

<style scoped></style>
