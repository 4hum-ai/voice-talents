<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <!-- Audio Info Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
        >
          <Icon name="mdi:music-note" class="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ title || 'Audio Sample' }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          @click="toggleMute"
          :aria-label="isMuted ? 'Unmute' : 'Mute'"
        >
          <Icon :name="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'" class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" @click="downloadAudio" aria-label="Download audio">
          <Icon name="mdi:download" class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Waveform Visualization -->
    <div class="mb-4">
      <div class="relative">
        <div
          ref="waveformContainer"
          class="relative h-16 cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
          @click="seekToPosition"
        >
          <!-- Waveform bars -->
          <div class="absolute inset-0 flex items-center justify-center space-x-0.5 px-2">
            <div
              v-for="(bar, index) in waveformData"
              :key="index"
              :class="[
                'rounded-sm bg-gray-400 transition-all duration-150 dark:bg-gray-500',
                index < currentBarIndex ? 'bg-blue-500 dark:bg-blue-400' : '',
                isPlaying ? 'animate-pulse' : '',
              ]"
              :style="{
                height: `${Math.max(4, bar * 100)}%`,
                width: '2px',
              }"
            />
          </div>

          <!-- Progress overlay -->
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
            :style="{ width: `${progressPercentage}%` }"
          />

          <!-- Time markers -->
          <div class="absolute bottom-1 left-2 text-xs text-gray-500 dark:text-gray-400">
            {{ formatTime(currentTime) }}
          </div>
          <div class="absolute right-2 bottom-1 text-xs text-gray-500 dark:text-gray-400">
            {{ formatTime(duration) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <!-- Play/Pause Button -->
        <Button
          :variant="isPlaying ? 'primary' : 'outline'"
          size="sm"
          @click="togglePlay"
          :disabled="!audioSrc"
          class="h-10 w-10 rounded-full p-0"
        >
          <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="h-5 w-5" />
        </Button>

        <!-- Speed Control -->
        <div class="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            @click="decreaseSpeed"
            :disabled="playbackRate <= 0.5"
            class="h-8 w-8 p-0"
          >
            <Icon name="mdi:minus" class="h-3 w-3" />
          </Button>
          <span
            class="min-w-[2rem] text-center text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            {{ playbackRate }}x
          </span>
          <Button
            variant="ghost"
            size="sm"
            @click="increaseSpeed"
            :disabled="playbackRate >= 2"
            class="h-8 w-8 p-0"
          >
            <Icon name="mdi:plus" class="h-3 w-3" />
          </Button>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2">
        <Icon name="mdi:volume-low" class="h-4 w-4 text-gray-500" />
        <input
          type="range"
          min="0"
          max="100"
          :value="volume * 100"
          @input="updateVolume"
          class="slider h-1 w-20 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
        />
        <Icon name="mdi:volume-high" class="h-4 w-4 text-gray-500" />
      </div>
    </div>

    <!-- Audio Element (Hidden) -->
    <audio
      ref="audioElement"
      :src="audioSrc"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
      preload="metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  audioSrc?: string
  title?: string
  autoPlay?: boolean
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: false,
  loop: false,
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeUpdate: [currentTime: number, duration: number]
}>()

// Refs
const audioElement = ref<HTMLAudioElement>()
const waveformContainer = ref<HTMLDivElement>()

// State
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const playbackRate = ref(1)

// Waveform data (mock data for demo)
const waveformData = ref<number[]>([])

// Computed
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const currentBarIndex = computed(() => {
  if (waveformData.value.length === 0) return 0
  return Math.floor((currentTime.value / duration.value) * waveformData.value.length)
})

// Methods
const generateWaveformData = () => {
  // Generate mock waveform data
  const bars = 50
  const data: number[] = []
  for (let i = 0; i < bars; i++) {
    data.push(Math.random() * 0.8 + 0.1) // Random height between 0.1 and 0.9
  }
  waveformData.value = data
}

const togglePlay = async () => {
  if (!audioElement.value) return

  try {
    if (isPlaying.value) {
      audioElement.value.pause()
    } else {
      await audioElement.value.play()
    }
  } catch (error) {
    console.error('Error toggling playback:', error)
  }
}

const toggleMute = () => {
  if (!audioElement.value) return

  isMuted.value = !isMuted.value
  audioElement.value.muted = isMuted.value
}

const updateVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newVolume = parseInt(target.value) / 100
  volume.value = newVolume

  if (audioElement.value) {
    audioElement.value.volume = newVolume
  }
}

const increaseSpeed = () => {
  if (playbackRate.value < 2) {
    playbackRate.value += 0.25
    if (audioElement.value) {
      audioElement.value.playbackRate = playbackRate.value
    }
  }
}

const decreaseSpeed = () => {
  if (playbackRate.value > 0.5) {
    playbackRate.value -= 0.25
    if (audioElement.value) {
      audioElement.value.playbackRate = playbackRate.value
    }
  }
}

const seekToPosition = (event: MouseEvent) => {
  if (!audioElement.value || !waveformContainer.value) return

  const rect = waveformContainer.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value

  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

const formatDuration = (seconds: number) => {
  if (isNaN(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTime = (seconds: number) => {
  return formatDuration(seconds)
}

const downloadAudio = () => {
  if (props.audioSrc) {
    const link = document.createElement('a')
    link.href = props.audioSrc
    link.download = props.title || 'audio-sample'
    link.click()
  }
}

// Event handlers
const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    volume.value = audioElement.value.volume
  }
}

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
    emit('timeUpdate', currentTime.value, duration.value)
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  emit('ended')
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

// Watch for audio source changes
watch(
  () => props.audioSrc,
  (newSrc) => {
    if (newSrc && audioElement.value) {
      audioElement.value.load()
    }
  },
)

onMounted(() => {
  generateWaveformData()

  if (audioElement.value) {
    audioElement.value.loop = props.loop
    audioElement.value.volume = volume.value
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
