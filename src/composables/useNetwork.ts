import { onMounted, onUnmounted, ref, Ref } from 'vue'

export type NetworkStatus = {
  isOnline: Ref<boolean>
}

export function useNetwork(): NetworkStatus {
  const isOnline = ref<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

  function handleOnline() {
    isOnline.value = true
  }

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

  return { isOnline }
}


