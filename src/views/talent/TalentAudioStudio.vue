<template>
  <div class="bg-background flex min-h-screen">
    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Voice Studio</template>
        <template #subtitle>{{ job?.title || 'Professional Voice Production' }}</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" icon="mdi:download" @click="exportProject">
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="mdi:send"
            @click="submitWork"
            :disabled="!canSubmit"
          >
            Submit Work
          </Button>
        </template>
      </AppBar>

      <!-- Studio Content -->
      <div class="flex h-[calc(100vh-4rem)] overflow-hidden pt-16">
        <!-- Left Panel - Video & Script -->
        <div class="flex flex-1 flex-col">
          <!-- Video Player Section -->
          <div
            class="border-border bg-card border-b p-4"
            :class="isVideoExpanded ? 'h-80' : 'h-48'"
          >
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Video Synchronization</h3>
              <div class="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  :icon="isVideoExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  @click="toggleVideoExpanded"
                >
                  {{ isVideoExpanded ? 'Collapse' : 'Expand' }}
                </Button>
                <Button variant="outline" size="sm" icon="mdi:upload" @click="loadVideo">
                  Load Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:sync"
                  @click="syncAudioVideo"
                  :disabled="!hasVideo"
                >
                  Sync Audio
                </Button>
              </div>
            </div>

            <!-- Video Player Container -->
            <div class="relative rounded-lg bg-black" :class="isVideoExpanded ? 'h-64' : 'h-32'">
              <div v-if="!hasVideo" class="flex h-full items-center justify-center">
                <div class="text-center text-white">
                  <div class="mb-2 text-2xl">🎬</div>
                  <p class="mb-1 text-sm">No video loaded</p>
                  <p class="text-xs opacity-75">
                    Load a video file to synchronize with your voice work
                  </p>
                </div>
              </div>
              <VideoPlayer
                v-else
                :url="videoUrl"
                mode="inline"
                class="h-full w-full"
                @time-update="onVideoTimeUpdate"
              />
            </div>
          </div>

          <!-- Script Segments -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Script & Transcript</h3>
              <div class="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  :icon="showTimeline ? 'mdi:view-grid' : 'mdi:timeline'"
                  @click="toggleTimelineView"
                >
                  {{ showTimeline ? 'Grid View' : 'Timeline View' }}
                </Button>
                <Button variant="outline" size="sm" icon="mdi:upload" @click="importScript">
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:robot"
                  @click="generateTTS"
                  :disabled="isGeneratingTTS"
                >
                  {{ isGeneratingTTS ? 'Generating...' : 'Generate TTS' }}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:play"
                  @click="playFullTTS"
                  :disabled="!hasTTS"
                >
                  Play All
                </Button>
              </div>
            </div>

            <!-- Timeline View -->
            <div v-if="showTimeline" class="mb-6">
              <div class="border-border bg-card rounded-lg border p-4">
                <h4 class="text-foreground mb-3 font-medium">Script Timeline</h4>
                <div class="space-y-2">
                  <div
                    v-for="(segment, index) in scriptSegments"
                    :key="index"
                    class="timeline-segment flex items-center space-x-3 rounded-lg p-2 transition-colors"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20': segment.isSelected,
                      'bg-green-50 dark:bg-green-900/20': segment.hasRecording,
                      'bg-purple-50 dark:bg-purple-900/20': segment.hasTTS && !segment.hasRecording,
                    }"
                  >
                    <div class="flex w-20 items-center space-x-2">
                      <span class="text-muted-foreground font-mono text-xs">{{
                        segment.startTime
                      }}</span>
                      <span class="text-muted-foreground text-xs">{{ segment.duration }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm">{{ segment.text }}</div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="mdi:play"
                        @click="playSegment(index)"
                        :disabled="!segment.hasAudio"
                        title="Play segment"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="mdi:microphone"
                        @click="recordSegment(index)"
                        title="Record segment"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="mdi:target"
                        @click="selectSegment(index)"
                        title="Select segment"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Script Segments Grid -->
            <div v-else class="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="(segment, index) in scriptSegments"
                :key="index"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
                :class="{
                  'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20':
                    segment.isSelected,
                  'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20':
                    segment.hasRecording,
                  'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20':
                    segment.hasTTS && !segment.hasRecording,
                }"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span
                      class="text-muted-foreground rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700"
                    >
                      {{ segment.startTime }}
                    </span>
                    <span class="text-muted-foreground text-xs">{{ segment.duration }}</span>
                    <span
                      v-if="segment.hasRecording"
                      class="rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Recorded
                    </span>
                    <span
                      v-else-if="segment.hasTTS"
                      class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      TTS
                    </span>
                  </div>

                  <div class="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="mdi:play"
                      @click="playSegment(index)"
                      :disabled="!segment.hasAudio"
                      title="Play segment"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="mdi:microphone"
                      @click="recordSegment(index)"
                      title="Record segment"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="mdi:target"
                      @click="selectSegment(index)"
                      title="Select segment"
                    />
                  </div>
                </div>

                <!-- Editable Text with Emotional Prompts -->
                <div class="mb-2">
                  <div
                    ref="segmentEditor"
                    :contenteditable="true"
                    @input="updateSegmentText(index, $event)"
                    @blur="updateSegmentText(index, $event)"
                    class="text-foreground emotional-highlight min-h-[60px] w-full resize-none rounded-md border border-gray-300 bg-transparent p-2 text-sm leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    :data-segment-index="index"
                  >
                    {{ segment.text }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Summary -->
            <div class="border-border bg-card mt-6 rounded-lg border p-4">
              <h4 class="text-foreground mb-3 font-medium">Project Progress</h4>
              <div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div class="text-center">
                  <div class="text-muted-foreground">Total Segments</div>
                  <div class="text-foreground text-lg font-semibold">
                    {{ scriptSegments.length }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-muted-foreground">Recorded</div>
                  <div class="text-lg font-semibold text-green-600">
                    {{ recordedSegmentsCount }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-muted-foreground">TTS Generated</div>
                  <div class="text-lg font-semibold text-blue-600">{{ ttsSegmentsCount }}</div>
                </div>
                <div class="text-center">
                  <div class="text-muted-foreground">Progress</div>
                  <div class="text-foreground text-lg font-semibold">
                    {{ Math.round((recordedSegmentsCount / scriptSegments.length) * 100) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Recording & Editing Controls -->
        <div class="border-border bg-card w-96 border-l p-4">
          <div class="mb-4 flex items-center justify-between">
            <h4 class="text-foreground font-medium">Recording & Editing</h4>
            <div v-if="selectedSegmentIndex !== null" class="text-muted-foreground text-sm">
              Segment {{ selectedSegmentIndex + 1 }}
            </div>
          </div>

          <!-- Current Segment Info -->
          <div
            v-if="selectedSegmentIndex !== null"
            class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20"
          >
            <h5 class="mb-1 text-sm font-medium text-blue-900 dark:text-blue-100">
              Current Segment
            </h5>
            <p class="text-xs text-blue-800 dark:text-blue-200">
              {{ scriptSegments[selectedSegmentIndex]?.text }}
            </p>
          </div>

          <!-- Recording Controls -->
          <div class="mb-6 flex flex-col items-center space-y-3">
            <div class="relative">
              <Button
                :variant="isRecording ? 'danger' : 'primary'"
                size="lg"
                @click="toggleRecording"
                class="h-16 w-16 rounded-full text-lg font-bold"
                :disabled="selectedSegmentIndex === null"
                :icon="isRecording ? 'mdi:stop' : 'mdi:microphone'"
              />
              <div
                v-if="isRecording"
                class="absolute -inset-2 animate-ping rounded-full border-2 border-red-500"
              ></div>
            </div>

            <div class="text-center">
              <p class="text-foreground text-sm font-medium">
                {{
                  isRecording
                    ? 'Recording...'
                    : selectedSegmentIndex !== null
                      ? 'Ready to Record'
                      : 'Select a segment to record'
                }}
              </p>
              <p class="text-muted-foreground text-xs">
                {{
                  isRecording
                    ? 'Click stop when finished'
                    : selectedSegmentIndex !== null
                      ? 'Click to start recording this segment'
                      : 'Click on a segment first'
                }}
              </p>
            </div>

            <!-- Recording Progress -->
            <div v-if="isRecording" class="w-full max-w-xs">
              <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-2 animate-pulse rounded-full bg-red-500" style="width: 60%"></div>
              </div>
              <p class="text-muted-foreground mt-1 text-center text-xs">
                Recording: {{ recordingTime }}
              </p>
            </div>
          </div>

          <!-- Audio Editing Tools -->
          <div class="space-y-4">
            <!-- Playback Controls -->
            <div
              class="audio-tool-group rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800"
            >
              <h5 class="text-foreground mb-2 text-sm font-medium">Playback</h5>
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:play"
                  @click="playRecording"
                  :disabled="!hasRecording"
                  class="enhanced-button flex-1"
                  title="Play recording"
                >
                  Play
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:pause"
                  @click="pauseRecording"
                  :disabled="!isPlaying"
                  class="enhanced-button flex-1"
                  title="Pause recording"
                >
                  Pause
                </Button>
              </div>
            </div>

            <!-- Editing Tools -->
            <div
              class="audio-tool-group rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800"
            >
              <h5 class="text-foreground mb-2 text-sm font-medium">Editing</h5>
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:scissors-cutting"
                  @click="cutAudio"
                  :disabled="!hasRecording"
                  class="enhanced-button flex-1"
                  title="Cut audio"
                >
                  Cut
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:delete"
                  @click="removeAudio"
                  :disabled="!hasRecording"
                  class="enhanced-button flex-1"
                  title="Remove audio"
                >
                  Remove
                </Button>
              </div>
            </div>

            <!-- Advanced Tools -->
            <div
              class="audio-tool-group rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800"
            >
              <h5 class="text-foreground mb-2 text-sm font-medium">Advanced</h5>
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:waveform"
                  @click="openWaveformEditor"
                  :disabled="!hasRecording"
                  class="enhanced-button flex-1"
                  title="Open waveform editor"
                >
                  Waveform
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:tune"
                  @click="openAudioEffects"
                  :disabled="!hasRecording"
                  class="enhanced-button flex-1"
                  title="Open audio effects"
                >
                  Effects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Recording Controls -->
      <div v-if="selectedSegmentIndex !== null" class="fixed right-6 bottom-6 z-50">
        <div
          class="floating-recording-btn rounded-full bg-white p-2 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
        >
          <Button
            :variant="isRecording ? 'danger' : 'primary'"
            size="lg"
            @click="toggleRecording"
            class="h-12 w-12 rounded-full"
            :icon="isRecording ? 'mdi:stop' : 'mdi:microphone'"
            :title="isRecording ? 'Stop recording' : 'Start recording'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import { useToast } from '@/composables/useToast'
import { useJob } from '@/composables/useJob'
import type { JobDetail } from '@/types/job-detail'

const route = useRoute()
const { success, error } = useToast()
const { getJob } = useJob()

// Job data
const job = ref<JobDetail | null>(null)

// Video state
const hasVideo = ref(false)
const videoUrl = ref('')
const currentVideoTime = ref(0)
const videoDuration = ref(0)

// Recording state
const isRecording = ref(false)
const hasRecording = ref(false)
const isPlaying = ref(false)
const recordingTime = ref('0:00')

// TTS state
const isGeneratingTTS = ref(false)
const hasTTS = ref(false)
const selectedSegmentIndex = ref<number | null>(null)

// UI state
const isVideoExpanded = ref(false)
const showTimeline = ref(false)

// Voice settings - keeping for future use
// const voiceSpeed = ref(1.0)
// const durationAdjustment = ref(0)

// Load job data
const loadJobData = () => {
  const jobId = route.params.id as string
  const jobData = getJob(jobId)

  if (jobData) {
    // Transform Job to JobDetail with script segments
    job.value = {
      ...jobData,
      progress: 65,
      voiceStyle: 'Professional',
      pace: 'Medium',
      tone: 'Friendly',
      duration: '2-3 minutes',
      recordingQuality: 'Professional',
      clientNotes: [
        'Emphasize the word "innovative" when describing our product features.',
        'Maintain consistent energy throughout the entire script.',
        'Please deliver the final audio by December 20th for review.',
      ],
      projectFiles: {
        script: {
          name: 'commercial_script_v2.pdf',
          size: 245760,
          type: 'application/pdf',
        },
        referenceAudio: {
          name: 'reference_voice_sample.mp3',
          size: 2097152,
          type: 'audio/mpeg',
        },
        additional: [
          {
            name: 'brand_guidelines.pdf',
            size: 1048576,
            type: 'application/pdf',
          },
          {
            name: 'product_images.zip',
            size: 5242880,
            type: 'application/zip',
          },
        ],
      },
      scriptSegments: [
        {
          text: 'Welcome to the future of innovation.',
          startTime: '00:00',
          duration: '3s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Our revolutionary product combines cutting-edge technology with elegant design to bring you an experience like never before.',
          startTime: '00:03',
          duration: '9s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: "With features that adapt to your lifestyle and performance that exceeds expectations, this isn't just a product – it's a game-changer.",
          startTime: '00:12',
          duration: '8s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Join thousands of satisfied customers who have already discovered the difference.',
          startTime: '00:20',
          duration: '6s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Order now and transform the way you work, play, and live.',
          startTime: '00:26',
          duration: '5s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: "Don't wait. The future is here, and it's waiting for you.",
          startTime: '00:31',
          duration: '4s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
      ],
    }
  } else {
    // Mock data for development
    job.value = {
      id: jobId,
      clientId: 'client-1',
      clientName: 'Acme Studios',
      title: 'Product Commercial Voice Over',
      description: 'Professional voice over for product commercial',
      voiceType: 'talent_only',
      projectType: 'commercial',
      status: 'active',
      priority: 'medium',
      budget: { max: 2000, currency: 'USD' },
      deadline: '2024-12-25',
      requirements: {
        language: 'English',
        voiceType: 'commercial',
        gender: 'any',
        specialInstructions: 'Professional voice over for product commercial',
        deliveryFormat: 'mp3_44khz',
        revisionRounds: '1',
      },
      files: {
        script: undefined,
        referenceAudio: undefined,
        additional: undefined,
      },
      talentOptions: {
        isPublic: true,
        pickOwn: false,
        selectedTalents: [],
      },
      premiumFeatures: {
        talentOutreach: false,
        aiMatching: false,
        autoPrompts: false,
      },
      paymentDetails: {
        method: 'direct',
      },
      requirePortfolio: true,
      isPublic: true,
      applications: [],
      selectedTalents: [],
      totalApplications: 0,
      viewCount: 0,
      createdDate: '2024-12-01',
      createdAt: '2024-12-01',
      updatedAt: '2024-12-15',
      progress: 65,
      voiceStyle: 'Professional',
      pace: 'Medium',
      tone: 'Friendly',
      duration: '2-3 minutes',
      recordingQuality: 'Professional',
      clientNotes: [
        'Emphasize the word "innovative" when describing our product features.',
        'Maintain consistent energy throughout the entire script.',
        'Please deliver the final audio by December 20th for review.',
      ],
      projectFiles: {
        script: {
          name: 'commercial_script_v2.pdf',
          size: 245760,
          type: 'application/pdf',
        },
        referenceAudio: {
          name: 'reference_voice_sample.mp3',
          size: 2097152,
          type: 'audio/mpeg',
        },
        additional: [
          {
            name: 'brand_guidelines.pdf',
            size: 1048576,
            type: 'application/pdf',
          },
          {
            name: 'product_images.zip',
            size: 5242880,
            type: 'application/zip',
          },
        ],
      },
      scriptSegments: [
        {
          text: 'Welcome to the future of innovation.',
          startTime: '00:00',
          duration: '3s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Our revolutionary product combines cutting-edge technology with elegant design to bring you an experience like never before.',
          startTime: '00:03',
          duration: '9s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: "With features that adapt to your lifestyle and performance that exceeds expectations, this isn't just a product – it's a game-changer.",
          startTime: '00:12',
          duration: '8s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Join thousands of satisfied customers who have already discovered the difference.',
          startTime: '00:20',
          duration: '6s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: 'Order now and transform the way you work, play, and live.',
          startTime: '00:26',
          duration: '5s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
        {
          text: "Don't wait. The future is here, and it's waiting for you.",
          startTime: '00:31',
          duration: '4s',
          hasTTS: false,
          hasRecording: false,
          hasAudio: false,
          isSelected: false,
        },
      ],
    }
  }
}

// Computed script segments
const scriptSegments = computed(() => job.value?.scriptSegments || [])

// Computed
const recordedSegmentsCount = computed(
  () => scriptSegments.value.filter((segment) => segment.hasRecording).length,
)

const ttsSegmentsCount = computed(
  () => scriptSegments.value.filter((segment) => segment.hasTTS).length,
)

const canSubmit = computed(() => recordedSegmentsCount.value > 0 || job.value?.finalAudio)

// Video methods
const loadVideo = () => {
  // Mock video loading
  hasVideo.value = true
  videoUrl.value =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  videoDuration.value = 35 // 35 seconds
  success('Video loaded successfully')
}

const syncAudioVideo = () => {
  success('Audio synchronized with video')
}

const onVideoTimeUpdate = (time: number) => {
  currentVideoTime.value = time
}

// UI methods
const toggleVideoExpanded = () => {
  isVideoExpanded.value = !isVideoExpanded.value
}

const toggleTimelineView = () => {
  showTimeline.value = !showTimeline.value
}

// Script methods
const importScript = () => {
  success('Script import dialog opened')
}

const updateSegmentText = (index: number, event: Event) => {
  const target = event.target as HTMLElement
  const text = target.innerText || target.textContent || ''

  console.log('updateSegmentText called:', {
    index,
    text,
    hasEmotionalTags: /\[([^\]]+)\]/.test(text),
  })

  // Update the segment text
  if (scriptSegments.value[index]) {
    scriptSegments.value[index].text = text
  }

  // Apply highlighting without cursor jumping
  highlightEmotionalTagsSafe(target)
}

const highlightEmotionalTagsSafe = (element: HTMLElement) => {
  const text = element.innerText || element.textContent || ''

  console.log('highlightEmotionalTagsSafe called:', {
    text,
    hasEmotionalTags: /\[([^\]]+)\]/.test(text),
  })

  // Check if there are any emotional tags to highlight
  if (!/\[([^\]]+)\]/.test(text)) {
    console.log('No emotional tags found, skipping highlighting')
    return // No tags to highlight
  }

  console.log('Found emotional tags, applying highlighting...')

  // Save cursor position more accurately
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    console.log('No selection found, applying highlighting without cursor preservation')
    // Apply highlighting without cursor preservation
    element.innerHTML = text.replace(
      /\[([^\]]+)\]/g,
      '<span class="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-1.5 py-0.5 rounded font-semibold text-sm inline-block mx-0.5 shadow-sm">[$1]</span>',
    )
    return
  }

  const range = selection.getRangeAt(0)
  const cursorOffset = range.startOffset

  console.log('Cursor offset:', cursorOffset)

  // Create a temporary element to get the highlighted HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = text.replace(
    /\[([^\]]+)\]/g,
    '<span class="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-1.5 py-0.5 rounded font-semibold text-sm inline-block mx-0.5 shadow-sm">[$1]</span>',
  )

  console.log('Highlighted HTML:', tempDiv.innerHTML)

  // Replace content without losing cursor position
  element.innerHTML = tempDiv.innerHTML

  // Restore cursor position
  try {
    const newRange = document.createRange()
    const textNodes = getTextNodes(element)
    let currentOffset = 0

    console.log('Text nodes found:', textNodes.length)

    for (const textNode of textNodes) {
      const nodeLength = textNode.textContent?.length || 0
      if (currentOffset + nodeLength >= cursorOffset) {
        newRange.setStart(textNode, cursorOffset - currentOffset)
        newRange.setEnd(textNode, cursorOffset - currentOffset)
        selection.removeAllRanges()
        selection.addRange(newRange)
        console.log('Cursor restored to position:', cursorOffset - currentOffset)
        break
      }
      currentOffset += nodeLength
    }
  } catch (e) {
    console.log('Error restoring cursor:', e)
  }
}

const getTextNodes = (element: HTMLElement): Text[] => {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)

  let node = walker.nextNode()
  while (node) {
    textNodes.push(node as Text)
    node = walker.nextNode()
  }

  return textNodes
}

// TTS methods
const generateTTS = async () => {
  isGeneratingTTS.value = true
  success('Generating TTS for all segments...')

  // Simulate TTS generation
  setTimeout(() => {
    scriptSegments.value.forEach((segment) => {
      segment.hasTTS = true
      segment.hasAudio = true
    })
    hasTTS.value = true
    isGeneratingTTS.value = false
    success('TTS generation completed!')
  }, 3000)
}

const playFullTTS = () => {
  success('Playing full TTS audio')
}

// Segment methods
const selectSegment = (index: number) => {
  // Clear previous selection
  scriptSegments.value.forEach((segment) => {
    segment.isSelected = false
  })

  // Select new segment
  scriptSegments.value[index].isSelected = true
  selectedSegmentIndex.value = index
  success(`Selected segment ${index + 1}`)
}

const playSegment = (index: number) => {
  const segment = scriptSegments.value[index]
  if (segment.hasRecording) {
    success(`Playing recorded segment ${index + 1}`)
  } else if (segment.hasTTS) {
    success(`Playing TTS segment ${index + 1}`)
  }
}

const recordSegment = (index: number) => {
  selectSegment(index)
  success(`Ready to record segment ${index + 1}`)
}

// Recording methods
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  if (selectedSegmentIndex.value === null) {
    error('Please select a segment to record')
    return
  }
  isRecording.value = true
  success(`Recording segment ${selectedSegmentIndex.value + 1}`)

  // Simulate recording timer
  let seconds = 0
  const timer = setInterval(() => {
    seconds++
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    recordingTime.value = `${mins}:${secs.toString().padStart(2, '0')}`
  }, 1000)

  // Store timer reference for cleanup
  ;(window as Window & { recordingTimer?: number }).recordingTimer = timer
}

const stopRecording = () => {
  isRecording.value = false
  hasRecording.value = true

  // Clear recording timer
  const windowWithTimer = window as Window & { recordingTimer?: number }
  if (windowWithTimer.recordingTimer) {
    clearInterval(windowWithTimer.recordingTimer)
    windowWithTimer.recordingTimer = undefined
  }

  if (selectedSegmentIndex.value !== null) {
    const segment = scriptSegments.value[selectedSegmentIndex.value]
    segment.hasRecording = true
    segment.hasAudio = true
    success(`Recording completed for segment ${selectedSegmentIndex.value + 1}`)
  }
}

const playRecording = () => {
  isPlaying.value = true
  success('Playing recording')
}

const pauseRecording = () => {
  isPlaying.value = false
  success('Paused recording')
}

const cutAudio = () => {
  success('Audio cutting tool opened')
}

const removeAudio = () => {
  hasRecording.value = false
  isPlaying.value = false
  success('Audio removed')
}

const openWaveformEditor = () => {
  success('Waveform editor opened')
}

const openAudioEffects = () => {
  success('Audio effects panel opened')
}

// Export methods
const exportProject = () => {
  success('Export dialog opened')
}

// Submit methods
const submitWork = () => {
  if (!canSubmit.value) {
    error('Please complete recording before submitting')
    return
  }
  success('Work submitted successfully!')
  // In real app, this would submit to backend
}

onMounted(() => {
  console.log('Voice Studio loaded for job:', route.params.id)
  loadJobData()
})

onBeforeUnmount(() => {
  // Cleanup is now handled by CSS only
})
</script>

<style scoped>
/* Recording animation */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Responsive grid for script segments */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Timeline view styling */
.timeline-segment {
  transition: all 0.2s ease-in-out;
}

.timeline-segment:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Floating recording button */
.floating-recording-btn {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Video panel transitions */
.video-panel {
  transition: height 0.3s ease-in-out;
}

/* Enhanced button hover effects */
.enhanced-button {
  transition: all 0.2s ease-in-out;
}

.enhanced-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Audio tool groups */
.audio-tool-group {
  transition: all 0.2s ease-in-out;
}

.audio-tool-group:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

/* Compact layout adjustments */
.studio-content {
  height: calc(100vh - 4rem);
}

.video-panel {
  height: 16rem; /* Reduced from h-80 (20rem) */
}

.recording-panel {
  width: 24rem; /* Reduced from w-96 */
}

/* Segment cards */
.segment-card {
  transition: all 0.2s ease-in-out;
  min-height: 120px;
}

.segment-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Simple CSS-only emotional tag highlighting */
.emotional-highlight {
  /* Use CSS to highlight emotional tags without DOM manipulation */
  position: relative;
}

/* Highlight emotional tags using CSS text-shadow */
.emotional-highlight {
  /* This will highlight emotional tags using CSS only */
  font-family: inherit;
  line-height: inherit;
}

/* Emotional tag highlighting - using Tailwind classes in JavaScript */

/* Contenteditable styling - using Tailwind classes in template */

/* Compact buttons */
.compact-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Progress grid */
.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

/* Video player container */
.video-container {
  position: relative;
  background: #000;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Recording button animation */
.recording-button {
  transition: all 0.3s ease;
}

.recording-button:hover {
  transform: scale(1.05);
}

.recording-button:active {
  transform: scale(0.95);
}

/* Audio editing grid */
.audio-editing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .video-panel {
    height: 14rem;
  }

  .recording-panel {
    width: 20rem;
  }
}

@media (max-width: 768px) {
  .studio-layout {
    flex-direction: column;
  }

  .video-panel {
    height: 12rem;
  }

  .recording-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }

  .progress-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .video-panel {
    height: 10rem;
  }

  .recording-panel {
    padding: 1rem;
  }

  .segment-card {
    min-height: 100px;
  }

  .progress-grid {
    grid-template-columns: 1fr;
  }
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
