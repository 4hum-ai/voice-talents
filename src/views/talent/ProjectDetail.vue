<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>{{ project?.title || 'Project Workspace' }}</template>
        <template #subtitle>{{ project?.clientName || 'Client Project' }}</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="saveProject">
            <Icon name="mdi:content-save" class="mr-2 h-4 w-4" />
            Save Project
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Left Column - Requirements -->
            <div class="space-y-6 lg:col-span-2">
              <Card class="p-6">
                <div class="mb-6 flex items-center">
                  <div
                    class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"
                  >
                    <Icon name="mdi:file-document-outline" class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 class="text-foreground text-xl font-semibold">Project Requirements</h2>
                    <p class="text-muted-foreground text-sm">
                      Review project details and specifications
                    </p>
                  </div>
                </div>

                <div class="space-y-6">
                  <!-- Project Overview -->
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                      <h3 class="text-foreground mb-3 text-lg font-semibold">Project Details</h3>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Client:</span>
                          <span class="font-medium">{{
                            project?.clientName || 'Acme Studios'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Type:</span>
                          <span class="font-medium">{{
                            project?.projectType || 'Commercial'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Deadline:</span>
                          <span class="font-medium">{{ project?.deadline || 'Dec 25, 2024' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Budget:</span>
                          <span class="font-medium text-green-600"
                            >${{ project?.budget || '1,500' }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                      <h3 class="text-foreground mb-3 text-lg font-semibold">Voice Requirements</h3>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Style:</span>
                          <span class="font-medium">{{
                            project?.voiceStyle || 'Professional'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Pace:</span>
                          <span class="font-medium">{{ project?.pace || 'Medium' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Tone:</span>
                          <span class="font-medium">{{ project?.tone || 'Friendly' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-muted-foreground">Duration:</span>
                          <span class="font-medium">{{ project?.duration || '2-3 minutes' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Project Description -->
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                    <h3 class="text-foreground mb-3 text-lg font-semibold">Project Description</h3>
                    <p class="text-muted-foreground leading-relaxed">
                      {{
                        project?.description ||
                        'We need a professional voice actor for our new product commercial. The script should be delivered with a warm, trustworthy tone that connects with our target audience. Please ensure clear pronunciation and appropriate pacing for a 30-second commercial spot.'
                      }}
                    </p>
                  </div>

                  <!-- Script Preview -->
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                    <h3 class="text-foreground mb-3 text-lg font-semibold">Script</h3>
                    <div
                      class="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    >
                      <p class="text-foreground text-sm leading-relaxed">
                        {{ scriptContent.substring(0, 300)
                        }}{{ scriptContent.length > 300 ? '...' : '' }}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" @click="openAudioStudio" class="mt-3">
                      <Icon name="mdi:eye" class="mr-2 h-4 w-4" />
                      View Full Script
                    </Button>
                  </div>

                  <!-- Client Notes -->
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                    <h3 class="text-foreground mb-3 text-lg font-semibold">Client Notes</h3>
                    <div class="space-y-3">
                      <div class="flex items-start space-x-3">
                        <Icon name="mdi:lightbulb-outline" class="mt-0.5 h-5 w-5 text-yellow-500" />
                        <p class="text-muted-foreground">
                          Emphasize the word "innovative" when describing our product features.
                        </p>
                      </div>
                      <div class="flex items-start space-x-3">
                        <Icon name="mdi:volume-high" class="mt-0.5 h-5 w-5 text-blue-500" />
                        <p class="text-muted-foreground">
                          Maintain consistent energy throughout the entire script.
                        </p>
                      </div>
                      <div class="flex items-start space-x-3">
                        <Icon name="mdi:clock-outline" class="mt-0.5 h-5 w-5 text-green-500" />
                        <p class="text-muted-foreground">
                          Please deliver the final audio by December 20th for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Right Column - Actions -->
            <div class="space-y-6">
              <!-- Audio Studio CTA -->
              <Card class="p-6">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500"
                  >
                    <Icon name="mdi:microphone" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-lg font-semibold">Audio Studio</h3>
                  <p class="text-muted-foreground mb-4 text-sm">
                    Record your voice with our professional recording tools
                  </p>
                  <Button variant="primary" size="lg" @click="openAudioStudio" class="w-full">
                    <Icon name="mdi:microphone" class="mr-2 h-5 w-5" />
                    Open Audio Studio
                  </Button>
                </div>
              </Card>

              <!-- Deliverables CTA -->
              <Card class="p-6">
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"
                  >
                    <Icon name="mdi:package-variant" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 text-lg font-semibold">Deliverables</h3>
                  <p class="text-muted-foreground mb-4 text-sm">Upload your final audio files</p>
                  <input
                    ref="deliverableInput"
                    type="file"
                    accept="audio/*"
                    class="hidden"
                    @change="handleDeliverableUpload"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    @click="triggerDeliverableUpload"
                    class="w-full"
                  >
                    <Icon name="mdi:upload" class="mr-2 h-5 w-5" />
                    Upload Audio
                  </Button>
                </div>
              </Card>

              <!-- Project Status -->
              <Card class="p-6">
                <h3 class="text-foreground mb-4 text-lg font-semibold">Project Status</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Progress:</span>
                    <span class="font-medium">{{ projectProgress }}%</span>
                  </div>
                  <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      :style="{ width: `${projectProgress}%` }"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Status:</span>
                    <span class="font-medium text-blue-600">In Progress</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Audio Studio Modal -->
    <div
      v-if="showAudioStudio"
      class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div class="bg-background mx-auto flex h-full w-full max-w-7xl flex-col rounded-lg shadow-xl">
        <!-- Modal Header -->
        <div class="border-border flex items-center justify-between border-b p-6">
          <div class="flex items-center">
            <div
              class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500"
            >
              <Icon name="mdi:microphone" class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-foreground text-2xl font-bold">Audio Studio</h2>
              <p class="text-muted-foreground text-sm">{{ project?.title }}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" @click="closeAudioStudio">
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>

        <!-- Modal Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Left Side - Transcript -->
          <div class="border-border w-1/2 overflow-y-auto border-r p-6">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Script & Transcript</h3>
              <div class="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="generateTTS"
                  :disabled="isGeneratingTTS"
                >
                  <Icon name="mdi:robot" class="mr-2 h-4 w-4" />
                  {{ isGeneratingTTS ? 'Generating...' : 'Generate TTS' }}
                </Button>
                <Button variant="outline" size="sm" @click="playFullTTS" :disabled="!hasTTS">
                  <Icon name="mdi:play" class="mr-2 h-4 w-4" />
                  Play All
                </Button>
              </div>
            </div>

            <!-- Script Segments -->
            <div class="max-h-96 space-y-3 overflow-y-auto">
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
                      <span
                        class="text-muted-foreground rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700"
                      >
                        {{ segment.startTime }}
                      </span>
                      <span class="text-muted-foreground text-xs">
                        {{ segment.duration }}
                      </span>
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
                      <Icon name="mdi:play" class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="recordSegment(index)">
                      <Icon name="mdi:microphone" class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="selectSegment(index)">
                      <Icon name="mdi:target" class="h-4 w-4" />
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
                  :variant="isRecording ? 'destructive' : 'primary'"
                  size="lg"
                  @click="toggleRecording"
                  class="h-32 w-32 rounded-full text-2xl font-bold"
                  :disabled="selectedSegmentIndex === null"
                >
                  <Icon :name="isRecording ? 'mdi:stop' : 'mdi:microphone'" class="h-12 w-12" />
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
                  <Icon name="mdi:play" class="mr-2 h-6 w-6" />
                  Play
                </Button>
                <Button variant="outline" size="lg" @click="cutAudio" :disabled="!hasRecording">
                  <Icon name="mdi:scissors-cutting" class="mr-2 h-6 w-6" />
                  Cut
                </Button>
                <Button variant="outline" size="lg" @click="removeAudio" :disabled="!hasRecording">
                  <Icon name="mdi:delete" class="mr-2 h-6 w-6" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const { success, error } = useToast()

// Modal states
const showAudioStudio = ref(false)

// Project data
const project = ref({
  id: route.params.id,
  title: 'Product Commercial Voice Over',
  clientName: 'Acme Studios',
  projectType: 'Commercial',
  deadline: 'Dec 25, 2024',
  budget: '1,500',
  voiceStyle: 'Professional',
  pace: 'Medium',
  tone: 'Friendly',
  duration: '2-3 minutes',
  description:
    'We need a professional voice actor for our new product commercial. The script should be delivered with a warm, trustworthy tone that connects with our target audience.',
})

// Script content
const scriptContent =
  ref(`Welcome to the future of innovation. Our revolutionary product combines cutting-edge technology with elegant design to bring you an experience like never before.

With features that adapt to your lifestyle and performance that exceeds expectations, this isn't just a product – it's a game-changer.

Join thousands of satisfied customers who have already discovered the difference. Order now and transform the way you work, play, and live.

Don't wait. The future is here, and it's waiting for you.`)

// Recording state
const isRecording = ref(false)
const hasRecording = ref(false)
const recordings = ref([
  { name: 'Take 1 - Full Script', duration: '2:34', size: '3.2 MB' },
  { name: 'Take 2 - Revised', duration: '2:28', size: '3.1 MB' },
  { name: 'Take 3 - Final', duration: '2:31', size: '3.2 MB' },
])

// TTS state
const isGeneratingTTS = ref(false)
const hasTTS = ref(false)
const selectedSegmentIndex = ref<number | null>(null)

// Script segments
const scriptSegments = ref([
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
])

// Final audio
const finalAudio = ref(null)
const deliveryNotes = ref('')

// Project progress
const projectProgress = ref(65)

// Audio input refs
const audioInput = ref<HTMLInputElement>()
const deliverableInput = ref<HTMLInputElement>()

// Modal methods
const openAudioStudio = () => {
  showAudioStudio.value = true
}

const closeAudioStudio = () => {
  showAudioStudio.value = false
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

const deleteRecording = (index: number) => {
  recordings.value.splice(index, 1)
  success('Recording deleted')
}

// Upload methods
const triggerAudioUpload = () => {
  audioInput.value?.click()
}

const handleAudioUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    success(`Audio file uploaded: ${file.name}`)
    finalAudio.value = {
      name: file.name,
      duration: '2:31',
      size: '3.2 MB',
    }
  }
}

const triggerDeliverableUpload = () => {
  deliverableInput.value?.click()
}

const handleDeliverableUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    success(`Deliverable uploaded: ${file.name}`)
    finalAudio.value = {
      name: file.name,
      duration: '2:31',
      size: '3.2 MB',
    }
    // Auto-submit to client after upload
    submitToClient()
  }
}

// Project methods
const saveProject = () => {
  success('Project saved successfully')
}

const submitToClient = () => {
  if (!finalAudio.value) {
    error('Please upload final audio before submitting')
    return
  }
  success('Project submitted to client successfully')
}

onMounted(() => {
  console.log('Project Detail loaded for project:', route.params.id)
})
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

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
