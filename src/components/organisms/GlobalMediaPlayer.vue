<template>
  <!-- Modal Mode -->
  <div
    v-if="isVisible && displayMode === 'modal'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
  >
    <div class="relative mx-4 w-full max-w-6xl">
      <!-- Header -->
      <div class="absolute -top-10 right-0 flex items-center gap-3 text-white">
        <span v-if="displayTitle" class="max-w-xs truncate text-sm">{{ displayTitle }}</span>
        <button
          class="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
          @click="handleClose"
        >
          Close
        </button>
      </div>

      <!-- Video Container -->
      <div class="overflow-hidden rounded-lg bg-black shadow-xl">
        <VideoPlayer
          :url="displayUrl"
          :title="displayTitle"
          :subtitle-url="displaySubtitleUrl"
          :mode="displayMode"
          @close="handleClose"
        />
      </div>
    </div>
  </div>

  <!-- Inline Mode -->
  <div v-else-if="isVisible && displayMode === 'inline'" class="w-full">
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
  mode?: 'modal' | 'inline'
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
