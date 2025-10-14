<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">
        Step 2: Project Details & Requirements
      </h1>
      <p class="text-muted-foreground text-lg">
        Define your {{ getVoiceSolutionLabel() }} project requirements
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left Column: Project Details -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Basic Information -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-6 text-lg font-semibold">Project Information</h3>

          <div class="space-y-4">
            <!-- Job Title -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Job Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="localTitle"
                type="text"
                required
                class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="e.g., Commercial Voice-Over for Tech Startup"
              />
            </div>

            <!-- Project/Voice Type (Combined) -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Project Type <span class="text-red-500">*</span>
              </label>
              <SelectInput
                v-model="localProjectType"
                :options="combinedProjectTypeOptions"
                placeholder="Select project type"
                required
              />
            </div>
          </div>
        </div>

        <!-- Voice Requirements -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-6 text-lg font-semibold">Voice Requirements</h3>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Language -->
            <div>
              <label for="language" class="text-foreground mb-2 block text-sm font-medium">
                Language <span class="text-red-500">*</span>
              </label>
              <SelectInput
                id="language"
                v-model="localRequirements.language"
                :options="languageOptions"
                placeholder="Select language"
              />
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="text-foreground mb-2 block text-sm font-medium">
                Gender Preference
              </label>
              <SelectInput
                id="gender"
                v-model="localRequirements.gender"
                :options="genderOptions"
              />
            </div>

            <!-- Project Deadline -->
            <div>
              <label for="deadline" class="text-foreground mb-2 block text-sm font-medium">
                Project Deadline <span class="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                v-model="localDeadline"
                type="date"
                required
                class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>

            <!-- Delivery Format -->
            <div>
              <label for="deliveryFormat" class="text-foreground mb-2 block text-sm font-medium">
                Delivery Format
              </label>
              <SelectInput
                id="deliveryFormat"
                v-model="localRequirements.deliveryFormat"
                :options="deliveryFormatOptions"
                placeholder="Select format"
              />
            </div>

            <!-- Revision Rounds -->
            <div class="md:col-span-2">
              <label for="revisionRounds" class="text-foreground mb-2 block text-sm font-medium">
                Revision Rounds
              </label>
              <SelectInput
                id="revisionRounds"
                v-model="localRequirements.revisionRounds"
                :options="revisionRoundsOptions"
                placeholder="Select revisions"
              />
            </div>
          </div>

          <!-- Special Instructions -->
          <div class="mt-4">
            <label for="specialInstructions" class="text-foreground mb-2 block text-sm font-medium">
              Special Instructions & Requirements
            </label>
            <textarea
              id="specialInstructions"
              v-model="localRequirements.specialInstructions"
              rows="4"
              class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
              placeholder="Describe your project, target audience, voice characteristics, tone, style requirements, and any other specific needs..."
            />
            <p class="text-muted-foreground mt-1 text-sm">
              Provide detailed context about your project and voice requirements
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: File Uploads -->
      <div class="lg:col-span-1">
        <div class="bg-card border-border sticky top-6 rounded-lg border p-6">
          <h3 class="text-foreground mb-6 text-lg font-semibold">Project Files</h3>

          <div class="space-y-4">
            <!-- Script Upload -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Script/Transcript
              </label>
              <FileUpload
                v-model="localFiles.script"
                accept=".pdf,.doc,.docx,.txt"
                :max-size="10"
                @upload="
                  (file: File | File[]) => handleScriptUpload(Array.isArray(file) ? file[0] : file)
                "
              />
              <p class="text-muted-foreground mt-2 text-xs">
                Upload your script or transcript. Max 10MB.
              </p>
            </div>

            <!-- Reference Audio -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Reference Audio
              </label>
              <FileUpload
                v-model="localFiles.referenceAudio"
                accept=".mp3,.wav,.m4a"
                :max-size="25"
                @upload="
                  (file: File | File[]) =>
                    handleReferenceUpload(Array.isArray(file) ? file[0] : file)
                "
              />
              <p class="text-muted-foreground mt-2 text-xs">
                Upload reference audio for voice matching. Max 25MB.
              </p>
            </div>

            <!-- Additional Files -->
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Additional Files
              </label>
              <FileUpload
                v-model="localFiles.additional"
                accept=".pdf,.doc,.docx,.txt,.srt,.vtt,.jpg,.png,.mp4"
                :max-size="50"
                :multiple="true"
                @upload="
                  (file: File | File[]) =>
                    handleAdditionalUpload(Array.isArray(file) ? file : [file])
                "
              />
              <p class="text-muted-foreground mt-2 text-xs">
                Upload subtitles, images, or videos. Max 50MB total.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="emit('previous')">
        <Icon name="mdi:arrow-left" class="mr-2 h-6 w-6" />
        Previous
      </Button>
      <Button variant="primary" size="lg" @click="emit('next')" :disabled="!isStepValid">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-6 w-6" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'
import Icon from '@/components/atoms/Icon.vue'
import type { VoiceType } from '@/types/voice-actor'

interface Requirements {
  language: string
  voiceType: VoiceType
  gender: 'male' | 'female' | 'non-binary' | 'any'
  specialInstructions: string
  deliveryFormat: string
  deliveryTimeline: string
  revisionRounds: string
}

interface ProjectFiles {
  script?: File
  referenceAudio?: File
  additional?: File[]
}

interface Props {
  title: string
  description: string
  projectType: string
  requirements: Requirements
  deadline: string
  files: ProjectFiles
  voiceSolution?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:projectType', value: string): void
  (e: 'update:requirements', value: Requirements): void
  (e: 'update:deadline', value: string): void
  (e: 'update:files', value: ProjectFiles): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTitle = ref(props.title)
const localProjectType = ref(props.projectType)
const localRequirements = ref<Requirements>({ ...props.requirements })
const localDeadline = ref(props.deadline)
const localFiles = ref<ProjectFiles>({ ...props.files })

// Combined Project/Voice Type Options
const combinedProjectTypeOptions = [
  { value: 'commercial', label: 'Commercial Voice-Over' },
  { value: 'audiobook_narrator', label: 'Audiobook Narration' },
  { value: 'character_voice', label: 'Character Voice' },
  { value: 'podcast', label: 'Podcast Voice' },
  { value: 'e-learning', label: 'E-Learning Narration' },
  { value: 'animation', label: 'Animation Voice' },
  { value: 'video_game', label: 'Video Game Voice' },
  { value: 'presentation', label: 'Presentation Voice' },
  { value: 'announcer', label: 'Announcer Voice' },
  { value: 'phone_system', label: 'Phone System Voice' },
  { value: 'app_voice', label: 'App Voice Interface' },
  { value: 'storyteller', label: 'Storytelling Voice' },
]

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'arabic', label: 'Arabic' },
]

const genderOptions = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
]

const deliveryFormatOptions = [
  { value: 'mp3_44khz', label: 'MP3 (44.1kHz)' },
  { value: 'wav_48khz', label: 'WAV (48kHz)' },
  { value: 'wav_96khz', label: 'WAV (96kHz)' },
  { value: 'aiff', label: 'AIFF' },
  { value: 'flac', label: 'FLAC' },
]

// Delivery timeline removed - using project deadline instead

const revisionRoundsOptions = [
  { value: '0', label: 'No Revisions' },
  { value: '1', label: '1 Revision' },
  { value: '2', label: '2 Revisions' },
  { value: '3', label: '3 Revisions' },
  { value: 'unlimited', label: 'Unlimited' },
]


// Computed properties

// Voice solution label helper
const getVoiceSolutionLabel = () => {
  switch (props.voiceSolution) {
    case 'talent_only':
      return 'talent-based voice acting'
    case 'ai_synthesis':
      return 'AI voice synthesis'
    case 'hybrid_approach':
      return 'hybrid voice'
    default:
      return 'voice acting'
  }
}

// Validation
const isStepValid = computed(() => {
  return (
    !!localTitle.value.trim() &&
    !!localProjectType.value &&
    !!localRequirements.value.language &&
    !!localDeadline.value
  )
})

// File upload handlers
const handleScriptUpload = (file: File) => {
  localFiles.value.script = file
  emit('update:files', localFiles.value)
}

const handleReferenceUpload = (file: File) => {
  localFiles.value.referenceAudio = file
  emit('update:files', localFiles.value)
}

const handleAdditionalUpload = (files: File[]) => {
  localFiles.value.additional = files
  emit('update:files', localFiles.value)
}

// Watch for changes and emit updates
watch(localTitle, (newValue) => emit('update:title', newValue))
watch(localProjectType, (newValue) => emit('update:projectType', newValue))
watch(
  localRequirements,
  (newValue) => {
    emit('update:requirements', newValue)
  },
  { deep: true },
)
watch(localDeadline, (newValue) => {
  emit('update:deadline', newValue)
})
watch(
  localFiles,
  (newValue) => {
    emit('update:files', newValue)
  },
  { deep: true },
)
</script>
