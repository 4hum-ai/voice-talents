import { ref } from 'vue'

const visible = ref(false)
const url = ref('')
const title = ref('')
const subtitleUrl = ref('')
const mode = ref<'inline'>('inline')

export function useGlobalMediaPlayer() {
  return {
    // Basic player state
    visible,
    url,
    title,
    subtitleUrl,
    mode,

    // Basic player methods
    open: (media: { url: string; title?: string; subtitleUrl?: string; mode?: 'inline' }) => {
      url.value = media.url
      title.value = media.title || ''
      subtitleUrl.value = media.subtitleUrl || ''
      mode.value = media.mode || 'inline'
      visible.value = true
    },

    close: () => {
      visible.value = false
      url.value = ''
      title.value = ''
      subtitleUrl.value = ''
      mode.value = 'inline'
    },

    // Utility methods
    isPlaying: () => {
      return visible.value
    },
  }
}
