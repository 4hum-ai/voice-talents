<template>
  <div class="bg-muted/20 rounded-lg border">
    <button
      @click="isOpen = !isOpen"
      class="hover:bg-muted/30 flex w-full items-center justify-between rounded-t-lg px-4 py-3 text-left transition-colors"
      :class="{ 'rounded-lg': !isOpen }"
    >
      <span class="text-foreground font-medium">{{ title }}</span>
      <div class="flex items-center space-x-2">
        <span
          v-if="count !== undefined"
          class="text-muted-foreground bg-muted rounded px-2 py-1 text-xs"
        >
          {{ count }}
        </span>
        <svg
          class="text-muted-foreground h-4 w-4 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>

    <div v-show="isOpen" class="space-y-3 px-4 pb-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  /** Title of the accordion section */
  title: string
  /** Optional count to display next to the title */
  count?: number
  /** Whether the section is open by default */
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})

const isOpen = ref(props.defaultOpen)
</script>
