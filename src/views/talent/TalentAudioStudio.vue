<template>
  <div class="bg-background flex min-h-screen">

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Audio Studio</template>
        <template #subtitle>{{ job?.title || 'Recording Session' }}</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="primary" size="sm" @click="submitWork" :disabled="!canSubmit">
            <SendIcon class="mr-2 h-4 w-4" />
            Submit Work
          </Button>
        </template>
      </AppBar>

      <!-- Studio Content -->
      <div class="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
        <!-- Left Side - Transcript -->
        <div class="w-1/2 overflow-y-auto border-r border-border p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-foreground text-lg font-semibold">Script & Transcript</h3>
            <div class="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                @click="generateTTS"
                :disabled="isGeneratingTTS"
              >
                <RobotIcon class="mr-2 h-4 w-4" />
                {{ isGeneratingTTS ? 'Generating...' : 'Generate TTS' }}
              </Button>
              <Button variant="outline" size="sm" @click="playFullTTS" :disabled="!hasTTS">
                <PlayIcon class="mr-2 h-4 w-4" />
                Play All
              </Button>
            </div>
          </div>

          <!-- Script Segments -->
          <div class="max-h-[calc(100vh-12rem)] space-y-3 overflow-y-auto">
            <div
              v-for="(segment, index) in scriptSegments"
              :key="index"
              class="rounded-lg border border-gray-200 p-3 dark:border-gray-600"
              :class="{
                'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20':
                  segment.isSelected,
              }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-2 flex items-center space-x-2">
                    <span class="text-muted-foreground rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
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
                  <p class="text-foreground text-sm leading-relaxed">{{ segment.text }}</p>
                </div>
                <div class="ml-3 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="playSegment(index)"
                    :disabled="!segment.hasAudio"
                  >
                    <PlayIcon class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="recordSegment(index)">
                    <MicrophoneIcon class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="selectSegment(index)">
                    <TargetIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Recording Controls -->
        <div class="flex w-1/2 flex-col p-6">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-foreground text-lg font-semibold">Recording Controls</h3>
            <div v-if="selectedSegmentIndex !== null" class="text-muted-foreground text-sm">
              Recording Segment {{ selectedSegmentIndex + 1 }}
            </div>
          </div>

          <!-- Current Segment Info -->
          <div
            v-if="selectedSegmentIndex !== null"
            class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
          >
            <h4 class="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
              Current Segment
            </h4>
            <p class="text-sm text-blue-800 dark:text-blue-200">
              {{ scriptSegments[selectedSegmentIndex]?.text }}
            </p>
          </div>

          <!-- Big Recording Button -->
          <div class="flex flex-1 flex-col items-center justify-center space-y-8">
            <div class="relative">
              <Button
                :variant="isRecording ? 'danger' : 'primary'"
                size="lg"
                @click="toggleRecording"
                class="h-32 w-32 rounded-full text-2xl font-bold"
                :disabled="selectedSegmentIndex === null"
              >
                <MicrophoneIcon v-if="!isRecording" class="h-12 w-12" />
                <StopIcon v-else class="h-12 w-12" />
              </Button>
              <div
                v-if="isRecording"
                class="absolute -inset-4 animate-ping rounded-full border-4 border-red-500"
              ></div>
            </div>

            <div class="text-center">
              <p class="text-foreground mb-2 text-lg font-medium">
                {{
                  isRecording
                    ? 'Recording...'
                    : selectedSegmentIndex !== null
                      ? 'Ready to Record'
                      : 'Select a segment to record'
                }}
              </p>
              <p class="text-muted-foreground text-sm">
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
            <div v-if="isRecording" class="w-full max-w-md">
              <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-3 animate-pulse rounded-full bg-red-500" style="width: 60%"></div>
              </div>
              <p class="text-muted-foreground mt-2 text-center text-sm">Recording time: 0:45</p>
            </div>
          </div>

          <!-- Audio Controls -->
          <div class="mt-8 space-y-4">
            <div class="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                @click="playRecording"
                :disabled="!hasRecording"
              >
                <PlayIcon class="mr-2 h-6 w-6" />
                Play
              </Button>
              <Button variant="outline" size="lg" @click="cutAudio" :disabled="!hasRecording">
                <ScissorsIcon class="mr-2 h-6 w-6" />
                Cut
              </Button>
              <Button variant="outline" size="lg" @click="removeAudio" :disabled="!hasRecording">
                <DeleteIcon class="mr-2 h-6 w-6" />
                Remove
              </Button>
            </div>
          </div>

          <!-- Progress Summary -->
          <div class="mt-8 rounded-lg border border-border bg-card p-4">
            <h4 class="text-foreground mb-3 font-medium">Recording Progress</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Total Segments:</span>
                <span class="text-foreground">{{ scriptSegments.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Recorded:</span>
                <span class="text-foreground text-green-600">{{ recordedSegmentsCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">TTS Generated:</span>
                <span class="text-foreground text-blue-600">{{ ttsSegmentsCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Progress:</span>
                <span class="text-foreground font-medium">{{ Math.round((recordedSegmentsCount / scriptSegments.length) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import { useToast } from '@/composables/useToast'
import { useJob } from '@/composables/useJob'
import type { JobDetail } from '@/types/job-detail'

// Icons
import MicrophoneIcon from '~icons/mdi/microphone'
import SendIcon from '~icons/mdi/send'
import RobotIcon from '~icons/mdi/robot'
import PlayIcon from '~icons/mdi/play'
import TargetIcon from '~icons/mdi/target'
import StopIcon from '~icons/mdi/stop'
import ScissorsIcon from '~icons/mdi/scissors-cutting'
import DeleteIcon from '~icons/mdi/delete'

const route = useRoute()
const { success, error } = useToast()
const { getJob } = useJob()

// Job data
const job = ref<JobDetail | null>(null)

// Recording state
const isRecording = ref(false)
const hasRecording = ref(false)

// TTS state
const isGeneratingTTS = ref(false)
const hasTTS = ref(false)
const selectedSegmentIndex = ref<number | null>(null)

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
          }
        ]
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
      ]
    }
  } else {
    // Mock data for development
    job.value = {
      id: jobId,
      clientId: 'client-1',
      clientName: 'Acme Studios',
      title: 'Product Commercial Voice Over',
      description: 'Professional voice over for product commercial',
      jobType: 'open_casting',
      projectType: 'commercial',
      status: 'active',
      priority: 'medium',
      budget: { min: 1000, max: 2000, currency: 'USD' },
      deadline: '2024-12-25',
      estimatedDuration: '2-3 weeks',
      requirements: {
        languages: ['English'],
        voiceTypes: ['commercial'],
        gender: 'any',
        experience: 'professional',
        specialInstructions: 'Professional voice over for product commercial',
        quality: 'professional'
      },
      deliverables: [],
      files: [],
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
          }
        ]
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
      ]
    }
  }
}

// Computed script segments
const scriptSegments = computed(() => job.value?.scriptSegments || [])

// Computed
const recordedSegmentsCount = computed(() => 
  scriptSegments.value.filter(segment => segment.hasRecording).length
)

const ttsSegmentsCount = computed(() => 
  scriptSegments.value.filter(segment => segment.hasTTS).length
)

const canSubmit = computed(() => 
  recordedSegmentsCount.value > 0 || job.value?.finalAudio
)


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
}

const stopRecording = () => {
  isRecording.value = false
  hasRecording.value = true

  if (selectedSegmentIndex.value !== null) {
    const segment = scriptSegments.value[selectedSegmentIndex.value]
    segment.hasRecording = true
    segment.hasAudio = true
    success(`Recording completed for segment ${selectedSegmentIndex.value + 1}`)
  }
}

const playRecording = (recording?: any) => {
  success(recording ? `Playing ${recording.name}` : 'Playing recording')
}

const cutAudio = () => {
  success('Audio cutting tool opened')
}

const removeAudio = () => {
  success('Audio removed')
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
  console.log('Talent Audio Studio loaded for job:', route.params.id)
  loadJobData()
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
</style>
