import { ref } from 'vue'

const visible = ref(false)
const url = ref('')
const title = ref('')
const subtitleUrl = ref('')
const mode = ref<'modal' | 'inline'>('modal')

export function useGlobalMediaPlayer() {
  return {
    visible,
    url,
    title,
    subtitleUrl,
    mode,
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
    },
    close: () => {
      visible.value = false
      url.value = ''
      title.value = ''
      subtitleUrl.value = ''
      mode.value = 'modal'
    },
  }
}
