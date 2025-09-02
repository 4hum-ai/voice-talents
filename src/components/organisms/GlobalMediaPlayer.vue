<template>
  <!-- Modal Mode -->
  <div
    v-if="isVisible && displayMode === 'modal'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    :class="{ 'pointer-events-none': isPipMode }"
  >
    <div
      class="relative overflow-hidden rounded-lg bg-black shadow-xl transition-all duration-300"
      :class="isPipMode ? 'pointer-events-auto' : 'mx-4 w-full max-w-6xl'"
      :style="isPipMode ? pipStyles : {}"
      @mousedown="isPipMode ? startDrag : undefined"
      @mousemove="isPipMode ? onDrag : undefined"
      @mouseup="isPipMode ? stopDrag : undefined"
      @mouseleave="isPipMode ? stopDrag : undefined"
    >
      <!-- Header -->
      <div v-if="!isPipMode" class="absolute -top-10 right-0 flex items-center gap-3 text-white">
        <span v-if="displayTitle" class="max-w-xs truncate text-sm">{{ displayTitle }}</span>
        <button
          class="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
          @click="handleClose"
        >
          Close
        </button>
      </div>

      <!-- PiP Header (when in PiP mode) -->
      <div
        v-if="isPipMode"
        class="absolute top-2 right-2 left-2 z-10 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div class="cursor-move text-white/60 transition-colors hover:text-white/80">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <span v-if="displayTitle" class="max-w-32 truncate text-xs text-white/80">{{
            displayTitle
          }}</span>
        </div>
        <button
          @click="handleClose"
          class="rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-red-500"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <!-- Video Container -->
      <div class="overflow-hidden">
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
import { computed, ref } from 'vue'
import { useGlobalMediaPlayer } from '@/composables/useGlobalMediaPlayer'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'

interface Props {
  visible?: boolean
  url?: string
  title?: string
  subtitleUrl?: string
  mode?: 'modal' | 'inline'
  pipMode?: boolean
  pipPosition?: { x: number; y: number }
  pipSize?: 'small' | 'medium' | 'large'
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

// PiP mode properties
const isPipMode = computed(() => props.pipMode ?? false)
const pipSize = computed(() => props.pipSize ?? 'small')

// Local PiP position state (can be overridden by props)
const localPipPosition = ref(props.pipPosition ?? { x: 20, y: 20 })
const pipPosition = computed(() => props.pipPosition ?? localPipPosition.value)

// PiP dimensions
const pipDimensions = computed(() => {
  const sizeMap = {
    small: { width: 320, height: 180 },
    medium: { width: 480, height: 270 },
    large: { width: 640, height: 360 },
  }
  return sizeMap[pipSize.value]
})

// PiP styles for positioning
const pipStyles = computed(() => {
  if (!isPipMode.value) return {}
  return {
    position: 'fixed' as const,
    left: `${pipPosition.value.x}px`,
    top: `${pipPosition.value.y}px`,
    width: `${pipDimensions.value.width}px`,
    height: `${pipDimensions.value.height}px`,
    zIndex: 60,
  }
})

// Drag state
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Drag methods
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - pipPosition.value.x,
    y: event.clientY - pipPosition.value.y,
  }
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return

  const newX = event.clientX - dragStart.value.x
  const newY = event.clientY - dragStart.value.y

  // Keep PiP within viewport bounds
  const maxX = window.innerWidth - pipDimensions.value.width
  const maxY = window.innerHeight - pipDimensions.value.height

  const boundedX = Math.max(0, Math.min(newX, maxX))
  const boundedY = Math.max(0, Math.min(newY, maxY))

  // Update position through emit or local state
  if (props.pipPosition === undefined) {
    // If not controlled by parent, update local state
    localPipPosition.value = { x: boundedX, y: boundedY }
  }
}

const stopDrag = () => {
  isDragging.value = false
}

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
