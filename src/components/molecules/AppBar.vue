<template>
  <div
    :class="[
      'border-border bg-card/90 border-b backdrop-blur',
      fixed ? 'fixed inset-x-0 top-0 z-40' : 'relative',
    ]"
  >
    <div class="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
      <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <IconButton
          v-if="showMenu"
          aria-label="Toggle menu"
          class="flex-shrink-0 lg:hidden"
          @click="$emit('menu')"
        >
          <MenuIcon class="h-5 w-5" />
        </IconButton>
        <IconButton
          v-if="showBack"
          aria-label="Go back"
          class="flex-shrink-0"
          @click="$emit('back')"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </IconButton>
        <div v-if="hasLeftSlot" class="min-w-0 flex-1">
          <slot name="left" />
        </div>
        <div v-else class="min-w-0 flex-1">
          <div class="text-foreground truncate text-sm font-semibold sm:text-base">
            <slot name="title" />
          </div>
          <div class="text-muted-foreground truncate text-xs">
            <slot name="subtitle" />
          </div>
        </div>
      </div>
      <div class="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import IconButton from '@/components/atoms/IconButton.vue'
import ChevronLeftIcon from '~icons/mdi/chevron-left'
import MenuIcon from '~icons/mdi/menu'

interface Props {
  loading?: boolean
  showBack?: boolean
  /** Whether to show the hamburger menu button (for mobile sidebar toggle) */
  showMenu?: boolean
  /** Whether the AppBar should be fixed at the top of the viewport */
  fixed?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showBack: false,
  showMenu: false,
  fixed: true,
})

defineEmits<{
  back: []
  menu: []
}>()

const slots = useSlots()
const hasLeftSlot = computed(() => Boolean(slots.left))
</script>

<style scoped></style>
