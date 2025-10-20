<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>{{ job?.title || 'Job Details' }}</template>
        <template #subtitle>{{ job?.clientName || 'Client Project' }}</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="goToAudioStudio">
            <MicrophoneIcon class="mr-2 h-4 w-4" />
            Audio Studio
          </Button>
          <Button variant="primary" size="sm" @click="submitWork" :disabled="!canSubmit">
            <SendIcon class="mr-2 h-4 w-4" />
            Submit Work
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div v-if="job" class="space-y-8">
            <!-- Job Overview -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <div class="mb-6 flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-4 flex items-center space-x-3">
                    <StatusBadge :status="getJobStatusDisplay(job.status)" />
                    <StatusBadge
                      :status="getProgressStatus(job.progress)"
                      :variant="getProgressVariant(job.progress)"
                      size="sm"
                    >
                      {{ job.progress }}% Complete
                    </StatusBadge>
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">{{ job.title }}</h2>
                  <p class="text-muted-foreground mb-4">{{ job.description }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <h3 class="text-foreground mb-3 font-medium">Project Details</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Client:</span>
                      <span class="text-foreground">{{ job.clientName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Type:</span>
                      <span class="text-foreground">{{ formatProjectType(job.projectType) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Deadline:</span>
                      <span class="text-foreground">{{ formatDate(job.deadline) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Budget:</span>
                      <span class="text-foreground font-medium text-green-600">
                        ${{ job.budget.max.toLocaleString() }} {{ job.budget.currency }}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-foreground mb-3 font-medium">Voice Requirements</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Style:</span>
                      <span class="text-foreground">{{ job.voiceStyle || 'Professional' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Pace:</span>
                      <span class="text-foreground">{{ job.pace || 'Medium' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Tone:</span>
                      <span class="text-foreground">{{ job.tone || 'Friendly' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Duration:</span>
                      <span class="text-foreground">{{ job.duration || '2-3 minutes' }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-foreground mb-3 font-medium">Recording Info</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Segments:</span>
                      <span class="text-foreground">{{ scriptSegments.length }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Recorded:</span>
                      <span class="text-foreground">{{ recordedSegmentsCount }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">TTS Generated:</span>
                      <span class="text-foreground">{{ ttsSegmentsCount }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Quality:</span>
                      <span class="text-foreground">{{ job.recordingQuality || 'Professional' }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-foreground mb-3 font-medium">Progress</h3>
                  <div class="space-y-3">
                    <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        class="h-3 rounded-full bg-blue-600 transition-all duration-300"
                        :style="{ width: `${job.progress}%` }"
                      ></div>
                    </div>
                    <div class="text-center text-sm">
                      <span class="text-foreground font-medium">{{ job.progress }}% Complete</span>
                    </div>
                    <div class="text-center">
                      <Button variant="primary" size="sm" @click="goToAudioStudio" class="w-full">
                        <MicrophoneIcon class="mr-2 h-4 w-4" />
                        Continue Recording
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <!-- Client Notes -->
            <div v-if="job.clientNotes" class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Client Notes</h3>
              <div class="space-y-3">
                <div
                  v-for="(note, index) in job.clientNotes"
                  :key="index"
                  class="flex items-start space-x-3"
                >
                  <LightbulbIcon class="mt-0.5 h-5 w-5 text-yellow-500" />
                  <p class="text-muted-foreground">{{ note }}</p>
                </div>
              </div>
            </div>

            <!-- Project Files -->
            <div v-if="job.projectFiles" class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>
              <div class="space-y-4">
                <!-- Script File -->
                <div v-if="job.projectFiles.script" class="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div class="flex items-center space-x-3">
                    <FileDocumentIcon class="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 class="text-foreground font-medium">{{ job.projectFiles.script.name }}</h4>
                      <p class="text-muted-foreground text-sm">{{ formatFileSize(job.projectFiles.script.size) }} • Script</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" @click="downloadFile(job.projectFiles.script)">
                      <DownloadIcon class="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" @click="viewFile(job.projectFiles.script)">
                      <EyeIcon class="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>

                <!-- Reference Audio -->
                <div v-if="job.projectFiles.referenceAudio" class="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div class="flex items-center space-x-3">
                    <AudioIcon class="h-8 w-8 text-green-600" />
                    <div>
                      <h4 class="text-foreground font-medium">{{ job.projectFiles.referenceAudio.name }}</h4>
                      <p class="text-muted-foreground text-sm">{{ formatFileSize(job.projectFiles.referenceAudio.size) }} • Reference Audio</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" @click="playReferenceAudio">
                      <PlayIcon class="mr-2 h-4 w-4" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm" @click="downloadFile(job.projectFiles.referenceAudio)">
                      <DownloadIcon class="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <!-- Additional Files -->
                <div v-if="job.projectFiles.additional && job.projectFiles.additional.length > 0" class="space-y-3">
                  <h4 class="text-foreground font-medium">Additional Files</h4>
                  <div
                    v-for="(file, index) in job.projectFiles.additional"
                    :key="index"
                    class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50"
                  >
                    <div class="flex items-center space-x-3">
                      <AttachmentIcon class="h-6 w-6 text-gray-600" />
                      <div>
                        <h5 class="text-foreground text-sm font-medium">{{ file.name }}</h5>
                        <p class="text-muted-foreground text-xs">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Button variant="outline" size="sm" @click="downloadFile(file)">
                        <DownloadIcon class="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deliverables -->
            <div class="bg-card border-border rounded-lg border p-6 shadow-sm">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Deliverables</h3>
              <div class="space-y-4">
                <div v-if="job.finalAudio" class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <AudioIcon class="h-8 w-8 text-green-600" />
                      <div>
                        <h4 class="text-foreground font-medium">{{ job.finalAudio.name }}</h4>
                        <p class="text-muted-foreground text-sm">{{ job.finalAudio.duration }} • {{ job.finalAudio.size }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Button variant="outline" size="sm" @click="playFinalAudio">
                        <PlayIcon class="mr-2 h-4 w-4" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm" @click="downloadFinalAudio">
                        <DownloadIcon class="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <UploadIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h4 class="text-foreground mb-2 font-medium">No deliverables uploaded yet</h4>
                  <p class="text-muted-foreground mb-4">Complete your recording and upload the final audio file</p>
                  <Button variant="outline" @click="goToAudioStudio">
                    <MicrophoneIcon class="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="py-12 text-center">
            <BriefcaseIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">Job not found</h3>
            <p class="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button variant="primary" @click="$router.push('/talent/jobs')">
              <ArrowLeftIcon class="mr-2 h-4 w-4" />
              Back to My Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
// import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import { useToast } from '@/composables/useToast'
import { useJob } from '@/composables/useJob'
import type { JobDetail } from '@/types/job-detail'
import { 
  getJobStatusDisplay, 
  getProgressStatus, 
  getProgressVariant, 
  formatProjectType, 
  formatDate,
  formatFileSize
} from '@/types/job-detail'

// Icons
import MicrophoneIcon from '~icons/mdi/microphone'
import SendIcon from '~icons/mdi/send'
import LightbulbIcon from '~icons/mdi/lightbulb-outline'
import AudioIcon from '~icons/mdi/audio'
import DownloadIcon from '~icons/mdi/download'
import UploadIcon from '~icons/mdi/upload'
import BriefcaseIcon from '~icons/mdi/briefcase'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import FileDocumentIcon from '~icons/mdi/file-document'
import AttachmentIcon from '~icons/mdi/attachment'
import EyeIcon from '~icons/mdi/eye'
import PlayIcon from '~icons/mdi/play'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()
const { getJob } = useJob()

// Job data - load from useJob composable or create mock data
const job = ref<JobDetail | null>(null)

// Load job data
const loadJobData = () => {
  const jobId = route.params.id as string
  const jobData = getJob(jobId)
  
  if (jobData) {
    // Transform Job to JobDetail
    job.value = {
      ...jobData,
      progress: 65, // This would come from actual progress tracking
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
          size: 245760, // 240 KB
          type: 'application/pdf',
        },
        referenceAudio: {
          name: 'reference_voice_sample.mp3',
          size: 2097152, // 2 MB
          type: 'audio/mpeg',
        },
        additional: [
          {
            name: 'brand_guidelines.pdf',
            size: 1048576, // 1 MB
            type: 'application/pdf',
          },
          {
            name: 'product_images.zip',
            size: 5242880, // 5 MB
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
          size: 245760, // 240 KB
          type: 'application/pdf',
        },
        referenceAudio: {
          name: 'reference_voice_sample.mp3',
          size: 2097152, // 2 MB
          type: 'audio/mpeg',
        },
        additional: [
          {
            name: 'brand_guidelines.pdf',
            size: 1048576, // 1 MB
            type: 'application/pdf',
          },
          {
            name: 'product_images.zip',
            size: 5242880, // 5 MB
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

// Navigation methods
const goToAudioStudio = () => {
  router.push(`/talent/jobs/${route.params.id}/studio`)
}


// Audio methods
const playFinalAudio = () => {
  success('Playing final audio')
}

const downloadFinalAudio = () => {
  success('Downloading final audio')
}

// File methods
const downloadFile = (file: any) => {
  success(`Downloading ${file.name}`)
  // In real app, this would trigger file download
}

const viewFile = (file: any) => {
  success(`Opening ${file.name}`)
  // In real app, this would open file viewer
}

const playReferenceAudio = () => {
  success('Playing reference audio')
  // In real app, this would use audio player component
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
  console.log('Talent Job Detail loaded for job:', route.params.id)
  loadJobData()
})
</script>

