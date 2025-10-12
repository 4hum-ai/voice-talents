<template>
  <div class="relative bg-black dark:bg-gray-900">
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
        <AlertCircleOutlineIcon class="h-12 w-12 text-red-500" />
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
            <PlayIcon v-if="!isPlaying" class="h-6 w-6" />
            <PauseIcon v-else class="h-6 w-6" />
          </button>

          <!-- Volume -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleMute"
              class="text-white transition-colors hover:text-blue-400"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
            >
              <VolumeHighIcon v-if="!isMuted" class="h-5 w-5" />
              <VolumeOffIcon v-else class="h-5 w-5" />
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
          <!-- Audio Track Selector -->
          <div v-if="hasMultipleAudioTracks" class="relative">
            <select
              :value="currentAudioTrack?.id || ''"
              @change="switchAudioTrack(($event.target as HTMLSelectElement).value)"
              class="appearance-none rounded bg-black/50 px-2 py-1 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option
                v-for="track in availableAudioTracks"
                :key="track.id"
                :value="track.id"
                class="bg-gray-800 text-white"
              >
                {{ track.label }}
              </option>
            </select>
            <ChevronDownIcon class="absolute top-1/2 right-1 h-3 w-3 -translate-y-1/2 text-white" />
          </div>

          <!-- Subtitle Toggle -->
          <button
            v-if="subtitleUrl"
            @click="toggleSubtitles"
            class="text-white transition-colors hover:text-blue-400"
            :class="{ 'text-blue-400': subtitlesEnabled }"
            :aria-label="subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'"
          >
            <SubtitlesIcon class="h-5 w-5" />
          </button>

          <!-- Picture-in-Picture -->
          <button
            @click="togglePip"
            class="text-white transition-colors hover:text-blue-400"
            :class="{ 'text-blue-400': isPipMode }"
            :aria-label="isPipMode ? 'Exit picture-in-picture' : 'Enter picture-in-picture'"
          >
            <IconPiPOutline class="h-5 w-5" />
          </button>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="text-white transition-colors hover:text-blue-400"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          >
            <FullscreenIcon v-if="!isFullscreen" class="h-5 w-5" />
            <FullscreenExitIcon v-else class="h-5 w-5" />
          </button>

          <!-- Close Button (for modal mode) -->
          <button
            v-if="mode === 'modal'"
            @click="emit('close')"
            class="text-white transition-colors hover:text-red-400"
            aria-label="Close"
          >
            <CloseIcon class="h-5 w-5" />
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
import { useCdn } from '@/composables/useCdn'
import Hls from 'hls.js'
import AlertCircleOutlineIcon from '~icons/mdi/alert-circle-outline'
import PlayIcon from '~icons/mdi/play'
import PauseIcon from '~icons/mdi/pause'
import VolumeHighIcon from '~icons/mdi/volume-high'
import VolumeOffIcon from '~icons/mdi/volume-off'
import ChevronDownIcon from '~icons/mdi/chevron-down'
import SubtitlesIcon from '~icons/mdi/subtitles'
import IconPiPOutline from '~icons/mdi/picture-in-picture-bottom-right-outline'
import FullscreenIcon from '~icons/mdi/fullscreen'
import FullscreenExitIcon from '~icons/mdi/fullscreen-exit'
import CloseIcon from '~icons/mdi/close'

interface Props {
  url: string
  title?: string
  subtitleUrl?: string
  audioTracks?: Array<{ id: string; label: string; lang?: string; url?: string }>
  selectedAudioId?: string
  mode: 'modal' | 'inline'
}

const props = defineProps<Props>()
// emit is used in the template for close button
const emit = defineEmits<{
  close: []
  'audio-track-change': [trackId: string]
}>()

// CDN composable
const { getCdnUrl } = useCdn()

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
const isPipMode = ref(false)

// Video state
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const progress = ref(0)
const currentSubtitle = ref('')

// HLS instance
let hls: Hls | null = null

// Audio track state
const currentAudioTrackId = ref<string | null>(null)

// Computed
const isHLS = computed(() => props.url.includes('.m3u8') || props.url.includes('.m3u'))

// Transform video URL to use CDN
const cdnVideoUrl = computed(() => {
  if (!props.url) return ''
  return getCdnUrl(props.url)
})

// Audio track computed properties
const availableAudioTracks = computed(() => props.audioTracks || [])
const hasMultipleAudioTracks = computed(() => availableAudioTracks.value.length > 1)
const currentAudioTrack = computed(() => {
  const trackId = currentAudioTrackId.value || props.selectedAudioId
  return (
    availableAudioTracks.value.find((track) => track.id === trackId) ||
    availableAudioTracks.value[0]
  )
})

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
        // Force audio track detection
        forceKeyFrameOnDiscontinuity: true,
        // Enable audio track switching
        enableSoftwareAES: true,
        // Debug mode to see what's happening
        debug: true,
      })

      // Debug: Log the manifest URL and content
      console.log('Loading HLS from URL:', cdnVideoUrl.value)

      // Try to fetch and log the actual manifest content
      fetch(cdnVideoUrl.value)
        .then((response) => response.text())
        .then((manifestText) => {
          console.log('Raw HLS manifest content:')
          console.log(manifestText)
        })
        .catch((err) => console.log('Could not fetch manifest for debugging:', err))

      hls.loadSource(cdnVideoUrl.value)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        loading.value = false
        console.log('HLS manifest parsed')
        console.log('Available audio tracks from hls.js:', hls?.audioTracks)
        console.log('Available audio tracks from props:', availableAudioTracks.value)
        console.log('Current audio track index:', hls?.audioTrack)
        console.log(
          'Video element audio tracks:',
          (video as HTMLVideoElement & { audioTracks?: unknown }).audioTracks,
        )
        console.log('HLS levels (video tracks):', hls?.levels)

        // Debug: Try to manually create audio tracks if hls.js didn't detect them
        if (
          hls?.audioTracks &&
          hls.audioTracks.length === 0 &&
          availableAudioTracks.value.length > 0
        ) {
          console.log('HLS.js did not detect audio tracks, but we have them in props')
          console.log('This suggests the m3u8-parser found audio tracks but hls.js did not')
          console.log('Available audio tracks from m3u8-parser:', availableAudioTracks.value)

          // The issue might be that hls.js needs the audio tracks to be loaded differently
          // Let's try to manually trigger audio track loading by fetching the audio playlists
          availableAudioTracks.value.forEach((track, index) => {
            console.log(`Audio track ${index}:`, track)
            if (track.url) {
              // Try to fetch the audio playlist to see if it's accessible
              fetch(track.url)
                .then((response) => response.text())
                .then((audioPlaylist) => {
                  console.log(`Audio playlist ${index} content:`, audioPlaylist)
                })
                .catch((err) => console.log(`Could not fetch audio playlist ${index}:`, err))
            }
          })
        }

        // Wait a bit and check audio tracks again (sometimes they load after manifest parsing)
        setTimeout(() => {
          console.log('Delayed audio tracks check:', hls?.audioTracks)
          if (hls?.audioTracks && hls.audioTracks.length > 0) {
            console.log('Audio tracks found after delay!')
          }
        }, 1000)

        // Set initial audio track if one is selected
        if (props.selectedAudioId && hls?.audioTracks && hls.audioTracks.length > 0) {
          console.log('Setting initial audio track:', props.selectedAudioId)
          switchAudioTrack(props.selectedAudioId)
        }

        // Ensure video element is not muted and has proper audio settings
        video.muted = false
        video.volume = 1
        console.log('Video element muted:', video.muted)
        console.log('Video element volume:', video.volume)

        video.play().catch(() => {
          // Autoplay failed, but video is ready
          loading.value = false
        })
      })

      // Add audio track change event listener
      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        console.log('Audio tracks updated:', hls?.audioTracks)
      })

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_event, data) => {
        console.log('Audio track switched:', data)
      })

      hls.on(Hls.Events.AUDIO_TRACK_LOADED, (_event, data) => {
        console.log('Audio track loaded:', data)
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          error.value = `HLS Error: ${data.details}`
          loading.value = false
        }
      })
    } else {
      // Standard video
      video.src = cdnVideoUrl.value
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

const switchAudioTrack = (trackId: string) => {
  if (!videoRef.value) return

  currentAudioTrackId.value = trackId
  emit('audio-track-change', trackId)

  if (isHLS.value && hls) {
    // For HLS, switch audio track using hls.js
    const audioTracks = hls.audioTracks
    console.log('Available HLS audio tracks:', audioTracks)
    console.log('Trying to switch to track ID:', trackId)

    // Find the track by matching the label or URL
    const selectedTrack = availableAudioTracks.value.find((track) => track.id === trackId)
    if (selectedTrack) {
      console.log('Selected track from manifest:', selectedTrack)

      // Try to find matching HLS track by label or URL
      const hlsTrackIndex = audioTracks.findIndex((hlsTrack) => {
        return (
          hlsTrack.name === selectedTrack.label ||
          hlsTrack.url === selectedTrack.url ||
          String(hlsTrack.id) === String(trackId)
        )
      })

      if (hlsTrackIndex !== -1) {
        console.log('Switching to HLS audio track index:', hlsTrackIndex)
        hls.audioTrack = Number(hlsTrackIndex)

        // Ensure video is not muted after switching
        if (videoRef.value) {
          videoRef.value.muted = false
          videoRef.value.volume = 1
          console.log('Audio track switched, video unmuted')
        }
      } else {
        console.log('Could not find matching HLS audio track')
        // Fallback: try to find by index if trackId contains a number
        const indexMatch = trackId.match(/(\d+)$/)
        if (indexMatch) {
          const index = parseInt(indexMatch[1])
          if (index >= 0 && index < audioTracks.length) {
            console.log('Using fallback index:', index)
            hls.audioTrack = Number(index)

            // Ensure video is not muted after switching
            if (videoRef.value) {
              videoRef.value.muted = false
              videoRef.value.volume = 1
              console.log('Audio track switched via fallback, video unmuted')
            }
          }
        }
      }
    }
  } else {
    // For regular video, we would need to handle this differently
    // This would typically involve switching the video source or using multiple audio elements
    console.log('Audio track switching for non-HLS video not yet implemented')
  }
}

const toggleSubtitles = () => {
  if (!videoRef.value) return

  const track = videoRef.value.textTracks[0]
  if (track) {
    track.mode = track.mode === 'showing' ? 'hidden' : 'showing'
    subtitlesEnabled.value = track.mode === 'showing'
  }
}

const togglePip = async () => {
  if (!videoRef.value) return

  try {
    if (!isPipMode.value) {
      // Enter PiP mode
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      }
      if (videoRef.value.requestPictureInPicture) {
        await videoRef.value.requestPictureInPicture()
        isPipMode.value = true
      }
    } else {
      // Exit PiP mode
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        isPipMode.value = false
      }
    }
  } catch (error) {
    console.warn('PiP not supported or failed:', error)
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

// PiP change listener
const onPipChange = () => {
  isPipMode.value = !!document.pictureInPictureElement
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

// Watch for selectedAudioId changes
watch(
  () => props.selectedAudioId,
  (newAudioId) => {
    if (newAudioId && newAudioId !== currentAudioTrackId.value) {
      switchAudioTrack(newAudioId)
    }
  },
)

// Lifecycle
onMounted(() => {
  if (props.url) {
    initializeVideo()
  }

  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('enterpictureinpicture', onPipChange)
  document.addEventListener('leavepictureinpicture', onPipChange)

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
      case 'KeyP':
        event.preventDefault()
        togglePip()
        break
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('enterpictureinpicture', onPipChange)
    document.removeEventListener('leavepictureinpicture', onPipChange)
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
