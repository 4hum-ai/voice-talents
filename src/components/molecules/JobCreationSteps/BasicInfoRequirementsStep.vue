<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-6 text-center sm:mb-8">
      <h1 class="text-foreground mb-3 text-2xl font-bold sm:text-3xl">Project Details</h1>
      <p class="text-muted-foreground text-base sm:text-lg">
        Tell us about your {{ getVoiceTypeLabel() }} project
      </p>
    </div>

    <div class="space-y-6">
      <!-- Core Information -->
      <div class="bg-card border-border rounded-lg border p-6">
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

          <!-- Project Type -->
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

          <!-- Special Instructions -->
          <div>
            <label for="specialInstructions" class="text-foreground mb-2 block text-sm font-medium">
              Project Description
            </label>
            <textarea
              id="specialInstructions"
              v-model="localRequirements.specialInstructions"
              rows="4"
              class="border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none"
              placeholder="Describe your project, target audience, and any specific requirements..."
            />
          </div>
        </div>
      </div>

      <!-- Project Files (Required) -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-base font-semibold">Project Files</h3>

        <div v-if="!localProjectType" class="bg-muted/50 rounded-lg p-4">
          <div class="text-muted-foreground flex items-center gap-2 text-sm">
            <Icon name="mdi:information" class="h-5 w-5" />
            <span>Select a project type to see file requirements</span>
          </div>
        </div>

        <div v-else-if="currentProjectConfig" class="space-y-4">
          <!-- Required Files -->
          <div v-if="currentProjectConfig.files.required.length">
            <div class="space-y-4">
              <div v-for="fileReq in currentProjectConfig.files.required" :key="fileReq.id">
                <label class="text-foreground mb-2 block text-sm font-medium">
                  {{ fileReq.label }}
                  <span class="text-red-500">*</span>
                </label>
                <FileUpload
                  :key="`required-${fileReq.id}`"
                  v-model="localFiles[fileReq.id]"
                  :accept="fileReq.acceptedFormats.join(',')"
                  :max-size="fileReq.maxSize"
                  :multiple="fileReq.multiple || false"
                  @upload="(file: File | File[]) => handleFileUpload(fileReq.id, file)"
                />
                <p class="text-muted-foreground mt-1 text-xs">
                  {{ fileReq.description }} Max {{ fileReq.maxSize }}MB.
                </p>
              </div>
            </div>
          </div>

          <!-- Optional Files -->
          <div v-if="currentProjectConfig.files.optional.length">
            <h4 class="text-foreground mb-3 text-sm font-medium">Optional Files</h4>
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
                <p class="text-muted-foreground mt-1 text-xs">
                  {{ fileReq.description }} Max {{ fileReq.maxSize }}MB.
                </p>
              </div>
            </div>
          </div>

          <!-- No Files Required -->
          <div
            v-if="
              !currentProjectConfig.files.required.length &&
              !currentProjectConfig.files.optional.length
            "
            class="bg-muted/50 rounded-lg p-4"
          >
            <div class="text-muted-foreground flex items-center gap-2 text-sm">
              <Icon name="mdi:file-check" class="h-5 w-5" />
              <span>No files required for this project type</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'
import Icon from '@/components/atoms/Icon.vue'
import type { VoiceType } from '@/types/voice-talent'
import { useJobType } from '@/composables/useJobType'

interface Requirements {
  language: string
  voiceType: VoiceType
  gender: 'male' | 'female' | 'non-binary' | 'any'
  ageRange?: string
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Helper function to get date 7 days from now
const getDateIn7Days = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

const localTitle = ref(props.title)
const localProjectType = ref(props.projectType)
const localRequirements = ref<Requirements>({
  ...props.requirements,
  deliveryFormat: props.requirements.deliveryFormat || 'mp3_44khz', // Default to ElevenLabs MP3
  revisionRounds: props.requirements.revisionRounds || '1', // Auto-set to 1
})
const localDeadline = ref(props.deadline || getDateIn7Days()) // Auto-set to 7 days from now
const localFiles = ref<ProjectFiles>({ ...props.files })

// Use job type configuration composable
const { getAllConfigs, getConfig } = useJobType()

// Generate project type options from composable
const combinedProjectTypeOptions = computed(() => {
  return getAllConfigs.value.map((config) => ({
    value: config.id,
    label: config.label,
  }))
})

// Get current project configuration based on selected project type
const currentProjectConfig = computed(() => {
  if (!localProjectType.value) return null
  return getConfig(localProjectType.value)
})

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'vietnamese', label: 'Vietnamese' },
]

// Removed optional fields: gender, ageRange, deliveryFormat, revisionRounds
// These can be added later if needed, but keeping core flow simple

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

// Validation is handled by parent modal

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

// Emit initial auto-set values on mount
onMounted(() => {
  if (!props.deadline && localDeadline.value) {
    emit('update:deadline', localDeadline.value)
  }
  if (!props.requirements.revisionRounds && localRequirements.value.revisionRounds) {
    emit('update:requirements', { ...localRequirements.value })
  }
})
</script>
