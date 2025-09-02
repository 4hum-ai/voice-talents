<template>
  <div class="relative bg-black">
    <!-- Video Element -->
    <video
      ref="videoRef"
      class="h-auto w-full"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      @play="onPlay"
      @pause="onPause"
      @volumechange="onVolumeChange"
      @seeking="onSeeking"
      @seeked="onSeeked"
    >
      <track
        v-if="subtitleUrl"
        kind="subtitles"
        :src="subtitleUrl"
        srclang="en"
        label="English"
        default
      />
      Your browser does not support the video tag.
    </video>

    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="flex flex-col items-center gap-3 text-white">
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
        ></div>
        <span class="text-sm">Loading...</span>
      </div>
    </div>

    <!-- Error Overlay -->
    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="flex flex-col items-center gap-3 text-white">
        <svg class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span class="text-center text-sm">{{ error }}</span>
        <button @click="retry" class="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30">
          Retry
        </button>
      </div>
    </div>

    <!-- Custom Controls -->
    <div
      v-show="!loading && !error"
      class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      @mouseenter="showControls = true"
      @mouseleave="hideControls"
    >
      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="relative h-1 w-full rounded-full bg-white/30">
          <div
            class="absolute top-0 left-0 h-full rounded-full bg-blue-500 transition-all duration-150"
            :style="{ width: `${progress}%` }"
          ></div>
          <input
            ref="progressInput"
            type="range"
            min="0"
            max="100"
            step="0.1"
            :value="progress"
            @input="onProgressChange"
            @mousedown="isSeeking = true"
            @mouseup="isSeeking = false"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Play/Pause -->
          <button
            @click="togglePlay"
            class="text-white transition-colors hover:text-blue-400"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
          >
            <svg v-if="!isPlaying" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          <!-- Volume -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleMute"
              class="text-white transition-colors hover:text-blue-400"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
            >
              <svg v-if="!isMuted" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                />
              </svg>
              <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                />
              </svg>
            </button>
            <input
              ref="volumeInput"
              type="range"
              min="0"
              max="100"
              step="1"
              :value="volume * 100"
              @input="onVolumeInputChange"
              class="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          <!-- Time Display -->
          <div class="text-sm text-white">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Subtitle Toggle -->
          <button
            v-if="subtitleUrl"
            @click="toggleSubtitles"
            class="text-white transition-colors hover:text-blue-400"
            :class="{ 'text-blue-400': subtitlesEnabled }"
            :aria-label="subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
              />
            </svg>
          </button>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="text-white transition-colors hover:text-blue-400"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          >
            <svg v-if="!isFullscreen" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </button>

          <!-- Close Button (for modal mode) -->
          <button
            v-if="mode === 'modal'"
            @click="emit('close')"
            class="text-white transition-colors hover:text-red-400"
            aria-label="Close"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Subtitle Overlay -->
    <div
      v-if="subtitleUrl && subtitlesEnabled && currentSubtitle"
      class="absolute bottom-20 left-1/2 -translate-x-1/2 transform text-center"
    >
      <div class="max-w-2xl rounded-lg bg-black/70 px-4 py-2 text-lg text-white">
        {{ currentSubtitle }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import Hls from 'hls.js'

interface Props {
  url: string
  title?: string
  subtitleUrl?: string
  mode: 'modal' | 'inline'
}

const props = defineProps<Props>()
// emit is used in the template for close button
const emit = defineEmits<{ close: [] }>()

// Refs
const videoRef = ref<HTMLVideoElement>()
const progressInput = ref<HTMLInputElement>()
const volumeInput = ref<HTMLInputElement>()

// State
const loading = ref(true)
const error = ref('')
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isSeeking = ref(false)
const showControls = ref(true)
const subtitlesEnabled = ref(true)

// Video state
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const progress = ref(0)
const currentSubtitle = ref('')

// HLS instance
let hls: Hls | null = null

// Computed
const isHLS = computed(() => props.url.includes('.m3u8') || props.url.includes('.m3u'))

// Methods
const initializeVideo = async () => {
  if (!videoRef.value) return

  const video = videoRef.value
  loading.value = true
  error.value = ''

  try {
    if (isHLS.value && Hls.isSupported()) {
      // Initialize HLS
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      hls.loadSource(props.url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        loading.value = false
        video.play().catch(() => {
          // Autoplay failed, but video is ready
          loading.value = false
        })
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          error.value = `HLS Error: ${data.details}`
          loading.value = false
        }
      })
    } else {
      // Standard video
      video.src = props.url
      video.load()

      video.onloadeddata = () => {
        loading.value = false
        video.play().catch(() => {
          loading.value = false
        })
      }

      video.onerror = () => {
        error.value = 'Failed to load video'
        loading.value = false
      }
    }
  } catch (err) {
    error.value = `Failed to initialize video: ${err instanceof Error ? err.message : 'Unknown error'}`
    loading.value = false
  }
}

const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
}

const toggleMute = () => {
  if (!videoRef.value) return

  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const toggleSubtitles = () => {
  if (!videoRef.value) return

  const track = videoRef.value.textTracks[0]
  if (track) {
    track.mode = track.mode === 'showing' ? 'hidden' : 'showing'
    subtitlesEnabled.value = track.mode === 'showing'
  }
}

const toggleFullscreen = () => {
  if (!videoRef.value) return

  if (!isFullscreen.value) {
    if (videoRef.value.requestFullscreen) {
      videoRef.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

const onProgressChange = (event: Event) => {
  if (!videoRef.value || isSeeking.value) return

  const target = event.target as HTMLInputElement
  const newTime = (parseFloat(target.value) / 100) * duration.value
  videoRef.value.currentTime = newTime
}

const onVolumeInputChange = (event: Event) => {
  if (!videoRef.value) return

  const target = event.target as HTMLInputElement
  const newVolume = parseFloat(target.value) / 100
  videoRef.value.volume = newVolume
  volume.value = newVolume
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const retry = () => {
  error.value = ''
  initializeVideo()
}

const hideControls = () => {
  if (isPlaying.value) {
    setTimeout(() => {
      showControls.value = false
    }, 2000)
  }
}

// Event handlers
const onLoadedMetadata = () => {
  if (!videoRef.value) return

  duration.value = videoRef.value.duration
  volume.value = videoRef.value.volume
  isMuted.value = videoRef.value.muted
}

const onTimeUpdate = () => {
  if (!videoRef.value || isSeeking.value) return

  currentTime.value = videoRef.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100
}

const onPlay = () => {
  isPlaying.value = true
  showControls.value = true
}

const onPause = () => {
  isPlaying.value = false
  showControls.value = true
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
}

const onError = () => {
  error.value = 'Video playback error'
  loading.value = false
}

const onSeeking = () => {
  isSeeking.value = true
}

const onSeeked = () => {
  isSeeking.value = false
}

const onVolumeChange = () => {
  if (!videoRef.value) return

  volume.value = videoRef.value.volume
  isMuted.value = videoRef.value.muted
}

// Fullscreen change listener
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// Watch for URL changes
watch(
  () => props.url,
  () => {
    if (props.url) {
      initializeVideo()
    }
  },
)

// Lifecycle
onMounted(() => {
  if (props.url) {
    initializeVideo()
  }

  document.addEventListener('fullscreenchange', onFullscreenChange)

  // Keyboard shortcuts
  const handleKeydown = (event: KeyboardEvent) => {
    if (!videoRef.value) return

    switch (event.code) {
      case 'Space':
        event.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        event.preventDefault()
        videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 10)
        break
      case 'ArrowRight':
        event.preventDefault()
        videoRef.value.currentTime = Math.min(duration.value, videoRef.value.currentTime + 10)
        break
      case 'KeyM':
        event.preventDefault()
        toggleMute()
        break
      case 'KeyF':
        event.preventDefault()
        toggleFullscreen()
        break
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('keydown', handleKeydown)

    if (hls) {
      hls.destroy()
      hls = null
    }
  })
})
</script>

<style scoped>
/* Custom range input styling */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
}
</style>
