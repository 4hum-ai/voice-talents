<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">
        Step 2: Project Details & Requirements
      </h1>
      <p class="text-muted-foreground text-lg">
        Define your {{ getVoiceTypeLabel() }} project requirements
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
                v-model="deliveryFormat"
                :options="deliveryFormatOptions"
                :placeholder="deliveryFormatOptions[0].label"
                disabled
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

          <!-- Project Type Selection Notice -->
          <div v-if="!localProjectType" class="mb-6 rounded-lg bg-muted/50 p-4">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Icon name="mdi:information" class="h-5 w-5" />
              <span class="text-sm">Select a project type to see specific file requirements</span>
            </div>
          </div>

          <!-- Dynamic File Requirements based on Project Type -->
          <div v-else class="space-y-6">
            <!-- Required Files Section -->
            <div v-if="currentProjectConfig?.files.required.length">
              <h4 class="text-foreground mb-4 text-sm font-semibold">
                Required Files
                <span class="text-muted-foreground text-xs font-normal">({{ currentProjectConfig.files.required.length }})</span>
              </h4>
              <div class="space-y-4">
                <div v-for="fileReq in currentProjectConfig.files.required" :key="fileReq.id">
                  <label class="text-foreground mb-2 block text-sm font-medium">
                    {{ fileReq.label }}
                    <span class="text-destructive">*</span>
                  </label>
                  <FileUpload
                    :key="`required-${fileReq.id}`"
                    v-model="localFiles[fileReq.id]"
                    :accept="fileReq.acceptedFormats.join(',')"
                    :max-size="fileReq.maxSize"
                    :multiple="fileReq.multiple || false"
                    @upload="(file: File | File[]) => handleFileUpload(fileReq.id, file)"
                  />
                  <p class="text-muted-foreground mt-2 text-xs">
                    {{ fileReq.description }} Max {{ fileReq.maxSize }}MB.
                  </p>
                </div>
              </div>
            </div>

            <!-- Optional Files Section -->
            <div v-if="currentProjectConfig?.files.optional.length">
              <h4 class="text-foreground mb-4 text-sm font-semibold">
                Optional Files
                <span class="text-muted-foreground text-xs font-normal">({{ currentProjectConfig.files.optional.length }})</span>
              </h4>
              <div class="space-y-4">
                <div v-for="fileReq in currentProjectConfig.files.optional" :key="fileReq.id">
                  <label class="text-foreground mb-2 block text-sm font-medium">
                    {{ fileReq.label }}
                    <span class="text-muted-foreground text-xs">(Optional)</span>
                  </label>
                  <FileUpload
                    :key="`optional-${fileReq.id}`"
                    v-model="localFiles[fileReq.id]"
                    :accept="fileReq.acceptedFormats.join(',')"
                    :max-size="fileReq.maxSize"
                    :multiple="fileReq.multiple || false"
                    @upload="(file: File | File[]) => handleFileUpload(fileReq.id, file)"
                  />
                  <p class="text-muted-foreground mt-2 text-xs">
                    {{ fileReq.description }} Max {{ fileReq.maxSize }}MB.
                  </p>
                </div>
              </div>
            </div>

            <!-- No Files Required -->
            <div v-if="!currentProjectConfig?.files.required.length && !currentProjectConfig?.files.optional.length" class="rounded-lg bg-muted/50 p-4">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Icon name="mdi:file-check" class="h-5 w-5" />
                <span class="text-sm">No specific files required for this project type</span>
              </div>
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
import { useJobType } from '@/composables/useJobType'

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
  [key: string]: File | File[] | undefined
}

interface Props {
  title: string
  description: string
  projectType: string
  requirements: Requirements
  deadline: string
  files: ProjectFiles
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
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
const localRequirements = ref<Requirements>({ 
  ...props.requirements,
  deliveryFormat: props.requirements.deliveryFormat || 'mp3_44khz' // Default to ElevenLabs MP3
})
const localDeadline = ref(props.deadline)
const localFiles = ref<ProjectFiles>({ ...props.files })

// Use job type configuration composable
const { getAllConfigs, getConfig } = useJobType()

// Generate project type options from composable
const combinedProjectTypeOptions = computed(() => {
  return getAllConfigs.value.map(config => ({
    value: config.id,
    label: config.label
  }))
})

// Get current project configuration based on selected project type
const currentProjectConfig = computed(() => {
  if (!localProjectType.value) return null
  return getConfig(localProjectType.value)
})

// Ensure delivery format is always set to default
const deliveryFormat = computed({
  get: () => localRequirements.value.deliveryFormat || 'mp3_44khz',
  set: (value) => {
    localRequirements.value.deliveryFormat = value
  }
})

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
]

const genderOptions = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
]

const deliveryFormatOptions = [
  { value: 'mp3_44khz', label: 'MP3 (44.1kHz)' },
  { value: 'wav_44khz', label: 'WAV (44.1kHz, 16-bit)' },
  { value: 'pcm_s16le', label: 'PCM S16LE (16kHz-44.1kHz)' },
  { value: 'opus_48khz', label: 'Opus (48kHz)' },
  { value: 'ulaw_8khz', label: 'μ-law (8kHz) - Telephony' },
  { value: 'alaw_8khz', label: 'A-law (8kHz) - Telephony' },
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

// Voice type label helper
const getVoiceTypeLabel = () => {
  switch (props.voiceType) {
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

// Dynamic file upload handler
const handleFileUpload = (fileId: string, file: File | File[]) => {
  if (Array.isArray(file)) {
    localFiles.value[fileId] = file
  } else {
    localFiles.value[fileId] = file
  }
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

// Watch for project type changes and clear files to avoid conflicts
watch(localProjectType, (newType, oldType) => {
  if (newType !== oldType) {
    // Clear all files when project type changes
    localFiles.value = {}
    emit('update:files', localFiles.value)
  }
})
</script>
