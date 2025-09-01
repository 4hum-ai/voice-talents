<template>
  <transition name="fade">
    <div
      v-if="isActive"
      class="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        class="bg-primary-600 animate-progressbar h-0.5 origin-left"
        role="progressbar"
        aria-busy="true"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useEventBus } from '@vueuse/core'
import { EVENT_HTTP_ACTIVE, type HttpActivePayload } from '@/types/events'

const isActive = ref(false)
let active = 0
let showTimer: number | null = null

const { on } = useEventBus<HttpActivePayload>(EVENT_HTTP_ACTIVE)
let offActive: (() => void) | null = null

function handleActive(payload: { active: number }) {
  active = Math.max(0, Number(payload?.active || 0))
  // Small delay to prevent flicker on very fast requests
  if (active > 0) {
    if (showTimer) window.clearTimeout(showTimer)
    showTimer = window.setTimeout(() => (isActive.value = true), 120)
  } else {
    if (showTimer) window.clearTimeout(showTimer)
    showTimer = null
    isActive.value = false
  }
}

onMounted(() => {
  offActive = on(handleActive)
})
onBeforeUnmount(() => {
  if (offActive) offActive()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes progress-indeterminate {
  0% {
    transform: scaleX(0.1);
  }
  50% {
    transform: scaleX(0.6);
  }
  100% {
    transform: scaleX(0.9);
  }
}
.animate-progressbar {
  animation: progress-indeterminate 1.2s ease-in-out infinite;
}
</style>
