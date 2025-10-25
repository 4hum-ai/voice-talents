<template>
  <div class="space-y-8">
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
      >
        <Icon name="mdi:upload" class="h-8 w-8 text-white" />
      </div>
      <h3 class="text-foreground mb-2 text-2xl font-semibold">Let's Hear Your Amazing Voice!</h3>
      <p class="text-muted-foreground">
        Upload samples for each type of voice work you selected. This showcases your incredible
        range and versatility!
      </p>
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
          <div v-if="props.voiceSamples[voiceType.value]" class="flex items-center space-x-2">
            <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
            <span class="text-sm text-green-600 dark:text-green-400">Uploaded</span>
          </div>
        </div>

        <!-- Upload Area for this Voice Type -->
        <div
          class="upload-area cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
          :class="{
            'drag-over border-blue-400 bg-blue-50 dark:bg-blue-900/20':
              isDragOver === voiceType.value,
            'border-green-400 bg-green-50 dark:bg-green-900/20':
              props.voiceSamples[voiceType.value],
          }"
          @dragover.prevent="isDragOver = voiceType.value"
          @dragleave.prevent="isDragOver = null"
          @drop.prevent="handleFileDrop($event, voiceType.value)"
          @click.stop="triggerFileInput(voiceType.value)"
        >
          <input
            :id="`file-input-${voiceType.value}`"
            :data-voice-type="voiceType.value"
            type="file"
            accept="audio/mp3,audio/wav,audio/ogg,audio/aac"
            class="hidden"
            @change="handleFileSelect($event, voiceType.value)"
          />

          <div v-if="!props.voiceSamples[voiceType.value]">
            <Icon name="mdi:cloud-upload" class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h5 class="text-foreground mb-2 text-lg font-medium">
              Drop your {{ voiceType.label.toLowerCase() }} sample here
            </h5>
            <p class="text-muted-foreground mb-4">or click to browse your files</p>
            <Button
              variant="primary"
              class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
              @click.stop="triggerFileInput(voiceType.value)"
            >
              <Icon name="mdi:folder-open" class="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>

          <!-- File Preview -->
          <div v-else class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon name="mdi:music-note" class="h-8 w-8 text-purple-500" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-foreground truncate text-sm font-medium">
                  {{ props.voiceSamples[voiceType.value].name }}
                </p>
                <p class="dark:text-muted-foreground text-sm text-gray-500">
                  {{ formatFileSize(props.voiceSamples[voiceType.value].size) }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <Button variant="ghost" size="sm" @click="removeFile(voiceType.value)">
                  <Icon name="mdi:close" class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <!-- Audio Preview -->
            <div>
              <audio
                :src="props.voiceSamples[voiceType.value].previewUrl"
                controls
                class="w-full"
              />
            </div>

            <!-- Sample Details -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  :for="`title-${voiceType.value}`"
                  class="text-foreground mb-2 block text-sm font-medium"
                >
                  Sample Title
                </label>
                <input
                  :id="`title-${voiceType.value}`"
                  :value="props.voiceSamples[voiceType.value].title"
                  type="text"
                  :placeholder="`${voiceType.label} Demo`"
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  @input="
                    updateSampleTitle(voiceType.value, ($event.target as HTMLInputElement).value)
                  "
                />
              </div>

              <div>
                <label
                  :for="`description-${voiceType.value}`"
                  class="text-foreground mb-2 block text-sm font-medium"
                >
                  Description
                </label>
                <input
                  :id="`description-${voiceType.value}`"
                  :value="props.voiceSamples[voiceType.value].description"
                  type="text"
                  placeholder="Describe this sample..."
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  @input="
                    updateSampleDescription(
                      voiceType.value,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dark:text-muted-foreground text-center text-sm text-gray-500">
      <p>Supported formats: MP3, WAV, OGG, AAC</p>
      <p>Maximum file size: 50MB per file</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useJobType } from '@/composables/useJobType'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

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

const isDragOver = ref<string | null>(null)

// Computed
const selectedVoiceTypes = computed(() => {
  return availableJobTypes.value.filter((option) =>
    props.profileData.voiceTypes.includes(option.value),
  )
})

// Voice sample upload methods
const triggerFileInput = (voiceType: string) => {
  console.log('Triggering file input for voice type:', voiceType)

  // Try to find the input by ID first
  let input = document.getElementById(`file-input-${voiceType}`) as HTMLInputElement

  if (!input) {
    // Fallback: find by data attribute
    input = document.querySelector(`input[data-voice-type="${voiceType}"]`) as HTMLInputElement
  }

  if (!input) {
    // Last resort: find by accept attribute and voice type
    const inputs = document.querySelectorAll('input[type="file"][accept*="audio"]')
    input = Array.from(inputs).find(
      (inp) => inp.getAttribute('data-voice-type') === voiceType,
    ) as HTMLInputElement
  }

  console.log('Found input element:', input)
  if (input) {
    input.click()
  } else {
    console.error('Could not find input element for voice type:', voiceType)
    console.log('Available inputs:', document.querySelectorAll('input[type="file"]'))
    error('File input not found. Please try refreshing the page.')
  }
}

const handleFileSelect = (event: Event, voiceType: string) => {
  console.log('File selected for voice type:', voiceType)
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  console.log('Selected file:', file)
  if (file) {
    processFile(file, voiceType)
  } else {
    console.log('No file selected')
  }
}

const handleFileDrop = (event: DragEvent, voiceType: string) => {
  isDragOver.value = null
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file, voiceType)
  }
}

const processFile = (file: File, voiceType: string) => {
  console.log('Processing file:', file.name, 'for voice type:', voiceType)

  // Validate file
  const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mpeg']
  const maxSize = 50 * 1024 * 1024 // 50MB

  if (!allowedTypes.includes(file.type)) {
    console.log('Invalid file type:', file.type)
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

  console.log('File processed successfully:', newVoiceSamples[voiceType])
  emit('update', newVoiceSamples)
  success(
    `Great! Your ${availableJobTypes.value.find((vt) => vt.value === voiceType)?.label} sample is ready!`,
  )
}

const removeFile = (voiceType: string) => {
  if (props.voiceSamples[voiceType]?.previewUrl) {
    URL.revokeObjectURL(props.voiceSamples[voiceType].previewUrl)
  }
  const newVoiceSamples = { ...props.voiceSamples }
  delete newVoiceSamples[voiceType]
  emit('update', newVoiceSamples)
}

const updateSampleTitle = (voiceType: string, title: string) => {
  const newVoiceSamples = { ...props.voiceSamples }
  if (newVoiceSamples[voiceType]) {
    newVoiceSamples[voiceType] = { ...newVoiceSamples[voiceType], title }
    emit('update', newVoiceSamples)
  }
}

const updateSampleDescription = (voiceType: string, description: string) => {
  const newVoiceSamples = { ...props.voiceSamples }
  if (newVoiceSamples[voiceType]) {
    newVoiceSamples[voiceType] = { ...newVoiceSamples[voiceType], description }
    emit('update', newVoiceSamples)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  transform: scale(1.02);
}

.upload-area.drag-over {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}
</style>
