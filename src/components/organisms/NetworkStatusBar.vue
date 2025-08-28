<template>
  <transition name="fade">
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-sm"
      role="status"
      aria-live="polite"
    >
      <div class="mx-auto max-w-7xl px-4 py-2 flex items-center gap-2 justify-center">
        <span class="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
        <span>You're offline. Some features are unavailable until connection is restored.</span>
      </div>
    </div>
  </transition>
  <div class="h-0" aria-hidden="true"></div>
  <!-- spacer for overlayed banner; content stays clickable -->
</template>

<script setup lang="ts">
import { useNetwork } from '@/composables/useNetwork'

const { isOnline } = useNetwork()
</script>

<style scoped>
@reference '../../assets/styles/main.css';

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200 ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>


