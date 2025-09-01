import { onMounted, onUnmounted, ref, Ref } from 'vue'

/**
 * Network status information
 */
export type NetworkStatus = {
  /** Reactive boolean indicating if the device is online */
  isOnline: Ref<boolean>
}

/**
 * Network connectivity monitoring composable
 *
 * @returns Network status service with reactive online/offline state
 *
 * @example
 * ```typescript
 * const network = useNetwork();
 *
 * // Check if online
 * console.log('Is online:', network.isOnline.value);
 *
 * // Watch for connectivity changes
 * watch(network.isOnline, (isOnline) => {
 *   if (isOnline) {
 *     console.log('Back online!');
 *   } else {
 *     console.log('Gone offline');
 *   }
 * });
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <div :class="{ 'offline': !network.isOnline }">
 *     <span v-if="network.isOnline">🟢 Online</span>
 *     <span v-else>🔴 Offline</span>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { useNetwork } from '@/composables/useNetwork';
 *
 * const network = useNetwork();
 * </script>
 * ```
 */
export function useNetwork(): NetworkStatus {
  const isOnline = ref<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

  /**
   * Handle online event - update state when connection is restored
   */
  function handleOnline() {
    isOnline.value = true
  }

  /**
   * Handle offline event - update state when connection is lost
   */
  function handleOffline() {
    isOnline.value = false
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    // Sync initial state in case it changed before mount
    isOnline.value = navigator.onLine
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    /** Reactive boolean indicating if the device is online */
    isOnline,
  }
}
