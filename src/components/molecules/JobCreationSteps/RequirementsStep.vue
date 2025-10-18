<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Step 3: Project Requirements</h1>
      <p class="text-muted-foreground text-lg">
        Define the voice requirements and delivery specifications
      </p>
    </div>

    <div class="space-y-6">
      <!-- Voice Requirements -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Voice Requirements</h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Voice Type -->
          <div>
            <label for="voiceType" class="text-foreground mb-2 block text-sm font-medium">
              Voice Type <span class="text-red-500">*</span>
            </label>
            <SelectInput
              id="voiceType"
              v-model="localRequirements.voiceType"
              :options="voiceTypeOptions"
              placeholder="Select voice type"
            />
          </div>

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
            <SelectInput id="gender" v-model="localRequirements.gender" :options="genderOptions" />
          </div>
        </div>

        <!-- Special Instructions -->
        <div class="mt-4">
          <label for="specialInstructions" class="text-foreground mb-2 block text-sm font-medium">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            v-model="localRequirements.specialInstructions"
            rows="3"
            class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="Any specific voice characteristics, tone, or style requirements..."
          />
        </div>
      </div>

      <!-- Delivery Requirements -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Delivery Requirements</h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <!-- Delivery Timeline -->
          <div>
            <label for="deliveryTimeline" class="text-foreground mb-2 block text-sm font-medium">
              Delivery Timeline
            </label>
            <SelectInput
              id="deliveryTimeline"
              v-model="localRequirements.deliveryTimeline"
              :options="deliveryTimelineOptions"
              placeholder="Select timeline"
            />
          </div>

          <!-- Revision Rounds -->
          <div>
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
        </div>
      </div>

      <!-- File Uploads -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>

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
              Reference Audio (Optional)
            </label>
            <FileUpload
              v-model="localFiles.referenceAudio"
              accept=".mp3,.wav,.m4a"
              :max-size="25"
              @upload="
                (file: File | File[]) => handleReferenceUpload(Array.isArray(file) ? file[0] : file)
              "
            />
            <p class="text-muted-foreground mt-2 text-xs">
              Upload reference audio for voice matching. Max 25MB.
            </p>
          </div>

          <!-- Additional Files -->
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium">
              Additional Files (Optional)
            </label>
            <FileUpload
              v-model="localFiles.additional"
              accept=".pdf,.doc,.docx,.txt,.srt,.vtt,.jpg,.png,.mp4"
              :max-size="50"
              :multiple="true"
              @upload="
                (file: File | File[]) => handleAdditionalUpload(Array.isArray(file) ? file : [file])
              "
            />
            <p class="text-muted-foreground mt-2 text-xs">
              Upload additional files like subtitles, images, or videos. Max 50MB total.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="emit('previous')">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>
      <Button variant="primary" size="lg" @click="emit('next')" :disabled="!isStepValid">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
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
  requirements: Requirements
  deadline: string
  files: ProjectFiles
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:requirements', value: Requirements): void
  (e: 'update:deadline', value: string): void
  (e: 'update:files', value: ProjectFiles): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localRequirements = ref<Requirements>({ ...props.requirements })
const localDeadline = ref(props.deadline)
const localFiles = ref<ProjectFiles>({ ...props.files })

// Options
const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character Voice' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'presenter', label: 'Presenter' },
  { value: 'storyteller', label: 'Storyteller' },
]

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
  { value: 'wav_48khz', label: 'WAV (48kHz)' },
  { value: 'wav_96khz', label: 'WAV (96kHz)' },
  { value: 'aiff', label: 'AIFF' },
  { value: 'flac', label: 'FLAC' },
]

const deliveryTimelineOptions = [
  { value: 'same_day', label: 'Same Day' },
  { value: '1_day', label: '1 Day' },
  { value: '2_3_days', label: '2-3 Days' },
  { value: '1_week', label: '1 Week' },
  { value: '2_weeks', label: '2 Weeks' },
  { value: '1_month', label: '1 Month' },
]

const revisionRoundsOptions = [
  { value: '0', label: 'No Revisions' },
  { value: '1', label: '1 Revision' },
  { value: '2', label: '2 Revisions' },
  { value: '3', label: '3 Revisions' },
  { value: 'unlimited', label: 'Unlimited' },
]

// Validation
const isStepValid = computed(() => {
  return (
    !!localRequirements.value.voiceType &&
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
