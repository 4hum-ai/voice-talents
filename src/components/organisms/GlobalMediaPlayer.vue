<template>
  <!-- Inline Mode Only -->
  <div v-if="isVisible && displayMode === 'inline'" class="w-full">
    <VideoPlayer
      :url="displayUrl"
      :title="displayTitle"
      :subtitle-url="displaySubtitleUrl"
      :mode="displayMode"
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalMediaPlayer } from '@/composables/useGlobalMediaPlayer'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'

interface Props {
  visible?: boolean
  url?: string
  title?: string
  subtitleUrl?: string
  mode?: 'inline'
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const player = useGlobalMediaPlayer()

// Use props if provided, otherwise fall back to global state
const isVisible = computed(() => props.visible ?? player.visible.value)
const displayUrl = computed(() => props.url ?? player.url.value)
const displayTitle = computed(() => props.title ?? player.title.value)
const displaySubtitleUrl = computed(() => props.subtitleUrl ?? player.subtitleUrl.value)
const displayMode = computed(() => props.mode ?? player.mode.value)

const handleClose = () => {
  if (props.visible !== undefined) {
    // If controlled by props, emit close event to parent
    emit('close')
  } else {
    // Use global player close
    player.close()
  }
}
</script>
