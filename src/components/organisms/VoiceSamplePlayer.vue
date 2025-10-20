<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900"
          >
            <MicrophoneIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-medium text-gray-900 dark:text-white">
            {{ sample?.title || 'Voice Sample' }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ sample?.genre }} • {{ sample?.tone }} • {{ formatDuration(currentTime) }} /
            {{ formatDuration(duration) }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="ghost" size="sm" @click="togglePlayPause" :disabled="!audioUrl">
          <PlayIcon v-if="!isPlaying" class="h-4 w-4" />
          <PauseIcon v-else class="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" @click="toggleMute">
          <VolumeHighIcon v-if="!isMuted && volume > 0" class="h-4 w-4" />
          <VolumeOffIcon v-else class="h-4 w-4" />
        </Button>

        <ActionsMenu :items="playerActions" size="sm" @select="handlePlayerAction" />
      </div>
    </div>

    <!-- Waveform Visualization -->
    <div class="px-4 py-3">
      <div class="relative">
        <!-- Waveform Container -->
        <div
          ref="waveformContainer"
          class="relative h-16 cursor-pointer overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700"
          @click="seekToPosition"
        >
          <!-- Waveform SVG -->
          <svg
            v-if="waveformData"
            class="h-full w-full"
            viewBox="0 0 400 64"
            preserveAspectRatio="none"
          >
            <g>
              <rect
                v-for="(bar, index) in waveformData"
                :key="index"
                :x="index * 2"
                :y="32 - bar / 2"
                :width="1.5"
                :height="bar"
                :fill="index <= currentProgressIndex ? '#8B5CF6' : '#D1D5DB'"
                class="transition-colors duration-150"
              />
            </g>
          </svg>

          <!-- Loading State -->
          <div v-else class="flex h-full w-full items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>

          <!-- Progress Overlay -->
          <div
            class="pointer-events-none absolute inset-0 bg-purple-500/20"
            :style="{ width: `${progressPercent}%` }"
          />

          <!-- Current Time Indicator -->
          <div
            class="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-purple-600"
            :style="{ left: `${progressPercent}%` }"
          />
        </div>

        <!-- Time Labels -->
        <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="px-4 pb-4">
      <div class="flex items-center space-x-4">
        <!-- Volume Control -->
        <div class="flex min-w-0 flex-1 items-center space-x-2">
          <VolumeHighIcon class="h-4 w-4 flex-shrink-0 text-gray-400" />
          <input
            v-model="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="slider h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
            @input="updateVolume"
          />
          <span class="w-8 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
            {{ Math.round(volume * 100) }}%
          </span>
        </div>

        <!-- Playback Speed -->
        <SelectInput
          v-model="playbackSpeed"
          :options="speedOptions"
          size="sm"
          class="w-20"
          @update:model-value="updatePlaybackSpeed"
        />

        <!-- Download Button -->
        <Button variant="ghost" size="sm" @click="downloadSample" :disabled="!sample">
          <DownloadIcon class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Sample Info -->
    <div v-if="sample" class="border-t border-gray-200 px-4 pt-4 pb-4 dark:border-gray-700">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-500 dark:text-gray-400">Language:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{ sample.language }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Accent:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{ sample.accent || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">File Size:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{
            formatFileSize(sample.fileSize)
          }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Format:</span>
          <span class="ml-2 text-gray-900 uppercase dark:text-white">{{ sample.format }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="sample.tags.length" class="mt-3">
        <div class="flex flex-wrap gap-1">
          <Chip v-for="tag in sample.tags" :key="tag" size="sm" variant="secondary">
            {{ tag }}
          </Chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { VoiceSample } from '@/types/voice-actor'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import Chip from '@/components/atoms/Chip.vue'
import MicrophoneIcon from '~icons/mdi/microphone'
import PlayIcon from '~icons/mdi/play'
import PauseIcon from '~icons/mdi/pause'
import VolumeHighIcon from '~icons/mdi/volume-high'
import VolumeOffIcon from '~icons/mdi/volume-off'

interface Props {
  sample?: VoiceSample
  audioUrl?: string
  waveformUrl?: string
  autoplay?: boolean
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  showInfo: true,
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeUpdate: [time: number]
  volumeChange: [volume: number]
}>()

// Audio state
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const playbackSpeed = ref(1)
const isLoading = ref(false)

// Waveform data
const waveformData = ref<number[]>([])
const waveformContainer = ref<HTMLElement>()

// Computed
const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const currentProgressIndex = computed(() => {
  if (!waveformData.value.length) return 0
  return Math.floor((currentTime.value / duration.value) * waveformData.value.length)
})

const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
]

const playerActions = [
  {
    key: 'share',
    label: 'Share Sample',
    icon: 'share',
  },
  {
    key: 'copy-link',
    label: 'Copy Link',
    icon: 'copy',
  },
  {
    key: 'favorite',
    label: 'Add to Favorites',
    icon: 'heart-outline',
  },
  {
    key: 'report',
    label: 'Report Issue',
    icon: 'flag',
    variant: 'danger' as const,
  },
]

// Methods
const initializeAudio = () => {
  if (!props.audioUrl) return

  audio.value = new Audio(props.audioUrl)

  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value?.duration || 0
  })

  audio.value.addEventListener('timeupdate', () => {
    currentTime.value = audio.value?.currentTime || 0
    emit('timeUpdate', currentTime.value)
  })

  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
    currentTime.value = 0
    emit('ended')
  })

  audio.value.addEventListener('play', () => {
    isPlaying.value = true
    emit('play')
  })

  audio.value.addEventListener('pause', () => {
    isPlaying.value = false
    emit('pause')
  })

  audio.value.volume = volume.value
  audio.value.playbackRate = playbackSpeed.value
}

const loadWaveform = async () => {
  if (!props.waveformUrl) {
    // Generate mock waveform data
    waveformData.value = Array.from({ length: 200 }, () => Math.random() * 64)
    return
  }

  try {
    isLoading.value = true
    const response = await fetch(props.waveformUrl)
    const data = await response.json()
    waveformData.value = data.waveform || Array.from({ length: 200 }, () => Math.random() * 64)
  } catch (error) {
    console.error('Failed to load waveform:', error)
    // Fallback to mock data
    waveformData.value = Array.from({ length: 200 }, () => Math.random() * 64)
  } finally {
    isLoading.value = false
  }
}

const togglePlayPause = () => {
  if (!audio.value) return

  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
}

const toggleMute = () => {
  if (!audio.value) return

  isMuted.value = !isMuted.value
  audio.value.muted = isMuted.value
}

const seekToPosition = (event: MouseEvent) => {
  if (!audio.value || !waveformContainer.value) return

  const rect = waveformContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const newTime = percentage * duration.value

  audio.value.currentTime = newTime
  currentTime.value = newTime
}

const updateVolume = () => {
  if (!audio.value) return

  audio.value.volume = volume.value
  isMuted.value = volume.value === 0
  audio.value.muted = isMuted.value
  emit('volumeChange', volume.value)
}

const updatePlaybackSpeed = () => {
  if (!audio.value) return

  audio.value.playbackRate = playbackSpeed.value
}

const downloadSample = () => {
  if (!props.sample?.audioUrl) return

  const link = document.createElement('a')
  link.href = props.sample.audioUrl
  link.download = `${props.sample.title}.${props.sample.format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (seconds: number) => {
  return formatTime(seconds)
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const handlePlayerAction = (action: string) => {
  switch (action) {
    case 'share':
      // Share functionality
      break
    case 'copy-link':
      // Copy link functionality
      break
    case 'favorite':
      // Favorite functionality
      break
    case 'report':
      // Report functionality
      break
  }
}

// Watchers
watch(
  () => props.audioUrl,
  () => {
    if (props.audioUrl) {
      initializeAudio()
    }
  },
)

watch(
  () => props.waveformUrl,
  () => {
    if (props.waveformUrl) {
      loadWaveform()
    }
  },
)

// Lifecycle
onMounted(() => {
  if (props.audioUrl) {
    initializeAudio()
  }
  if (props.waveformUrl) {
    loadWaveform()
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
