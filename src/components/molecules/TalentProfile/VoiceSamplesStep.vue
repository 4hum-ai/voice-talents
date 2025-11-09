<template>
  <div class="space-y-8">
    <div class="text-center">
      <h3 class="text-foreground mb-2 text-2xl font-semibold">Show Your Amazing Voice!</h3>
      <p class="text-muted-foreground">Upload samples for each type you selected.</p>
    </div>

    <!-- Voice Type Upload Areas -->
    <div class="space-y-6">
      <div
        v-for="voiceType in selectedVoiceTypes"
        :key="voiceType.value"
        class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
              <Icon name="mdi:microphone" class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-foreground text-lg font-semibold">
                {{ voiceType.label }}
              </h4>
              <p class="text-muted-foreground text-sm">
                Share a sample of your {{ voiceType.label.toLowerCase() }} work
              </p>
            </div>
          </div>
        </div>

        <!-- Upload Area for this Voice Type -->
        <FileUpload
          :key="`${voiceType.value}-${voiceTypeFiles[voiceType.value]?.name || 'no-file'}`"
          :model-value="voiceTypeFiles[voiceType.value]"
          accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4,audio/x-m4a"
          :max-size="50"
          :show-button="true"
          @update:model-value="(file) => handleFileUpdate(file, voiceType.value)"
          @update:preview-url="(url) => handlePreviewUrlUpdate(url, voiceType.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useJobType } from '@/composables/useJobType'
import Icon from '@/components/atoms/Icon.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'

interface VoiceSample {
  file: File
  name: string
  size: number
  previewUrl: string
  title: string
  description: string
}

interface Props {
  profileData: {
    voiceTypes: string[]
  }
  voiceSamples: Record<string, VoiceSample>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<Props['voiceSamples']>]
}>()

const { success, error } = useToast()
const { availableJobTypes } = useJobType()

// Computed
const selectedVoiceTypes = computed(() => {
  return availableJobTypes.value.filter((option) =>
    props.profileData.voiceTypes.includes(option.value),
  )
})

// Create a computed map of files for reactivity
const voiceTypeFiles = computed(() => {
  const files: Record<string, File | null> = {}
  selectedVoiceTypes.value.forEach((voiceType) => {
    files[voiceType.value] = props.voiceSamples[voiceType.value]?.file || null
  })
  return files
})

// Voice sample upload methods
const handleFileUpdate = (file: File | File[] | null, voiceType: string) => {
  if (!file) {
    // File removed
    if (props.voiceSamples[voiceType]?.previewUrl) {
      URL.revokeObjectURL(props.voiceSamples[voiceType].previewUrl)
    }
    const newVoiceSamples = { ...props.voiceSamples }
    delete newVoiceSamples[voiceType]
    emit('update', newVoiceSamples)
    return
  }

  // File selected - process it (only handle single file, not array)
  const fileToProcess = Array.isArray(file) ? file[0] : file
  if (fileToProcess) {
    processFile(fileToProcess, voiceType)
  }
}

const handlePreviewUrlUpdate = (previewUrl: string | null, voiceType: string) => {
  // Update preview URL if file already exists
  if (props.voiceSamples[voiceType] && previewUrl) {
    const newVoiceSamples = { ...props.voiceSamples }
    newVoiceSamples[voiceType] = {
      ...newVoiceSamples[voiceType],
      previewUrl: previewUrl || '',
    }
    emit('update', newVoiceSamples)
  }
}

const processFile = (file: File, voiceType: string) => {
  // Validate file
  const allowedTypes = [
    'audio/mp3',
    'audio/mpeg', // iOS MP3 format
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/mp4', // iOS M4A format
    'audio/x-m4a', // Alternative M4A format
  ]
  const maxSize = 50 * 1024 * 1024 // 50MB

  if (!allowedTypes.includes(file.type)) {
    error(`Please select a valid audio file. File type "${file.type}" is not supported.`)
    return
  }

  if (file.size > maxSize) {
    error('File size must be less than 50MB')
    return
  }

  // Create preview URL
  const previewUrl = URL.createObjectURL(file)

  // Store the file data
  const newVoiceSamples = { ...props.voiceSamples }
  newVoiceSamples[voiceType] = {
    file,
    name: file.name,
    size: file.size,
    previewUrl,
    title: file.name.replace(/\.[^/.]+$/, ''),
    description: '',
  }

  emit('update', newVoiceSamples)
  success(
    `Great! Your ${availableJobTypes.value.find((vt) => vt.value === voiceType)?.label} sample is ready!`,
  )
}
</script>
