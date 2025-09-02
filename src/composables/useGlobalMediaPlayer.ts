import { ref } from 'vue'

const visible = ref(false)
const url = ref('')
const title = ref('')
const subtitleUrl = ref('')
const mode = ref<'modal' | 'inline'>('modal')

// PiP (Picture-in-Picture) state
const pipMode = ref(false)
const pipPosition = ref({ x: 20, y: 20 }) // Default position (bottom-right)
const pipSize = ref<'small' | 'medium' | 'large'>('small')

export function useGlobalMediaPlayer() {
  return {
    // Basic player state
    visible,
    url,
    title,
    subtitleUrl,
    mode,

    // PiP state
    pipMode,
    pipPosition,
    pipSize,

    // Basic player methods
    open: (media: {
      url: string
      title?: string
      subtitleUrl?: string
      mode?: 'modal' | 'inline'
    }) => {
      url.value = media.url
      title.value = media.title || ''
      subtitleUrl.value = media.subtitleUrl || ''
      mode.value = media.mode || 'modal'
      visible.value = true
      pipMode.value = false // Exit PiP when opening new media
    },

    close: () => {
      visible.value = false
      pipMode.value = false // Exit PiP when closing
      url.value = ''
      title.value = ''
      subtitleUrl.value = ''
      mode.value = 'modal'
    },

    // PiP methods
    enterPip: () => {
      if (visible.value && url.value) {
        pipMode.value = true
        visible.value = false // Hide full player when entering PiP
      }
    },

    exitPip: () => {
      pipMode.value = false
      visible.value = true // Show full player when exiting PiP
    },

    togglePip: () => {
      if (pipMode.value) {
        pipMode.value = false
        visible.value = true // Show full player when exiting PiP
      } else {
        if (visible.value && url.value) {
          pipMode.value = true
          visible.value = false // Hide full player when entering PiP
        }
      }
    },

    updatePipPosition: (x: number, y: number) => {
      pipPosition.value = { x, y }
    },

    setPipSize: (size: 'small' | 'medium' | 'large') => {
      pipSize.value = size
    },

    // Utility methods
    isPlaying: () => {
      return visible.value || pipMode.value
    },

    getPipDimensions: () => {
      const sizeMap = {
        small: { width: 320, height: 180 },
        medium: { width: 480, height: 270 },
        large: { width: 640, height: 360 },
      }
      return sizeMap[pipSize.value]
    },
  }
}
