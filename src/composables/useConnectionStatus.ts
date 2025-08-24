import { ref, computed, readonly } from 'vue'
import { useMovieService } from './useMovieService'

const isConnected = ref<boolean | null>(null)
const lastCheck = ref<Date | null>(null)
const checking = ref(false)

const connectionStatus = computed(() => {
  if (isConnected.value === null) return 'unknown'
  return isConnected.value ? 'connected' : 'disconnected'
})
const isConnectionHealthy = computed(() => isConnected.value === true)

export function useConnectionStatus() {
  const movie = useMovieService()
  const checkConnection = async (): Promise<boolean> => {
    checking.value = true
    try {
      const connected = await movie.checkConnection()
      isConnected.value = connected
      lastCheck.value = new Date()
      return connected
    } catch (e) {
      isConnected.value = false
      lastCheck.value = new Date()
      return false
    } finally {
      checking.value = false
    }
  }

  const resetConnectionStatus = () => {
    isConnected.value = null
    lastCheck.value = null
  }

  return {
    isConnected: readonly(isConnected),
    lastCheck: readonly(lastCheck),
    checking: readonly(checking),
    connectionStatus,
    isConnectionHealthy,
    checkConnection,
    resetConnectionStatus
  }
}


