<template>
  <div class="file-upload">
    <!-- Upload Area -->
    <div
      class="border-border hover:border-primary/50 relative cursor-pointer rounded-lg border-2 border-dashed transition-colors"
      :class="{
        'border-primary bg-primary/5': isDragOver,
        'border-destructive': hasError,
        'p-4 sm:p-6': !hasFile,
        'p-2 sm:p-3': hasFile,
      }"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Empty State -->
      <div v-if="!hasFile" class="space-y-3 text-center">
        <div class="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon name="mdi:cloud-upload" class="text-muted-foreground h-6 w-6" />
        </div>

        <div>
          <p class="text-foreground text-sm font-medium">
            {{ isDragOver ? dropText : uploadText }}
          </p>
          <p v-if="secondaryText" class="text-muted-foreground mt-1 mb-4 text-sm">
            {{ secondaryText }}
          </p>
          <p class="text-muted-foreground mt-1 text-xs">
            {{ acceptText }} (max {{ maxSize }}MB{{ multiple ? ' each' : '' }})
          </p>
        </div>

        <Button
          v-if="showButton"
          variant="primary"
          class="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          @click.stop="triggerFileInput"
        >
          <Icon name="mdi:folder-open" class="mr-2 h-4 w-4" />
          {{ buttonText }}
        </Button>
      </div>

      <!-- Uploaded State - Small indicator (reusing empty state icon/text) -->
      <div v-else class="flex items-center justify-center gap-2">
        <div class="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon name="mdi:cloud-upload" class="text-muted-foreground h-4 w-4" />
        </div>
        <span class="text-foreground text-sm font-medium">
          {{ isDragOver ? dropText : uploadText }}
        </span>
        <span v-if="multiple" class="text-muted-foreground text-xs">• Click to upload more</span>
      </div>
    </div>

    <!-- Error Message (right below upload area) -->
    <p v-if="hasError" class="text-destructive mt-1.5 text-xs sm:text-sm">
      {{ errorMessage }}
    </p>

    <!-- File Preview -->
    <div v-if="hasFile && !multiple && modelValue" class="mt-3 space-y-4">
      <div class="bg-card border-border flex items-center gap-3 rounded-lg border p-3">
        <div
          class="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        >
          <Icon
            :name="
              getFileIcon(
                Array.isArray(modelValue) ? modelValue[0]?.type : (modelValue as File).type,
              )
            "
            class="h-5 w-5"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-foreground truncate text-sm font-medium"
            :title="
              Array.isArray(modelValue) ? `${modelValue.length} files` : (modelValue as File).name
            "
          >
            {{
              Array.isArray(modelValue) ? `${modelValue.length} files` : (modelValue as File).name
            }}
          </p>
          <p class="text-muted-foreground text-xs">
            {{
              Array.isArray(modelValue)
                ? formatFileSize(modelValue.reduce((sum, file) => sum + file.size, 0))
                : formatFileSize((modelValue as File).size)
            }}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          @click.stop="removeFile()"
          class="text-muted-foreground hover:text-destructive flex-shrink-0"
        >
          <Icon name="mdi:close" class="h-4 w-4" />
        </Button>
      </div>

      <!-- Audio Preview -->
      <div v-if="modelValue && isAudioFile(modelValue) && previewUrl" class="w-full">
        <audio :src="previewUrl" controls class="w-full" />
      </div>
    </div>

    <!-- Multiple Files Preview -->
    <div v-if="modelValue && multiple && Array.isArray(modelValue)" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in modelValue"
        :key="index"
        class="bg-card border-border flex items-center gap-3 rounded-lg border p-3"
      >
        <div
          class="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        >
          <Icon :name="getFileIcon(file.type)" class="h-5 w-5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-foreground truncate text-sm font-medium" :title="file.name">
            {{ file.name }}
          </p>
          <p class="text-muted-foreground text-xs">{{ formatFileSize(file.size) }}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          @click="removeFile(index)"
          class="text-muted-foreground hover:text-destructive flex-shrink-0"
        >
          <Icon name="mdi:close" class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  modelValue?: File | File[] | null
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
  uploadText?: string
  dropText?: string
  secondaryText?: string
  showButton?: boolean
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  maxSize: 10,
  multiple: false,
  premiumFeature: false,
  uploadText: 'Click to upload or drag and drop',
  dropText: 'Drop files here',
  secondaryText: '',
  showButton: false,
  buttonText: 'Browse',
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
  upload: [file: File | File[]]
  'update:previewUrl': [url: string | null]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const previewUrl = ref<string | null>(null)

// Helper functions
const isAudioFile = (file: File | File[]): boolean => {
  const fileObj = Array.isArray(file) ? file[0] : file
  return fileObj?.type?.startsWith('audio/') ?? false
}

const isVideoFile = (file: File | File[]): boolean => {
  const fileObj = Array.isArray(file) ? file[0] : file
  return fileObj?.type?.startsWith('video/') ?? false
}

// Watch for external modelValue changes to create preview URL
watch(
  () => props.modelValue,
  (newValue) => {
    // If value became null/undefined, clear everything
    if (!newValue || newValue === null || newValue === undefined) {
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
      }
      emit('update:previewUrl', null)
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      return
    }

    const file = Array.isArray(newValue) ? newValue[0] : newValue
    if (file && file instanceof File && (isAudioFile(file) || isVideoFile(file))) {
      // Clean up old preview URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = URL.createObjectURL(file)
      emit('update:previewUrl', previewUrl.value)
    } else {
      // Not an audio/video file, clear preview URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
      }
      emit('update:previewUrl', null)
    }
  },
  { immediate: true },
)

// Computed properties
const hasFile = computed(() => {
  const value = props.modelValue
  if (!value || value === null || value === undefined) return false
  if (props.multiple && Array.isArray(value)) {
    return value.length > 0
  }
  // For single file mode, check if it's actually a File object
  if (value instanceof File) {
    return true
  }
  return false
})

const acceptText = computed(() => {
  if (props.accept === '*/*') return 'Any file type'

  const parts = props.accept.split(',').map((part) => {
    const trimmed = part.trim()
    // Handle MIME types like "audio/mp3" -> "MP3"
    if (trimmed.includes('/')) {
      const mimeParts = trimmed.split('/')
      if (mimeParts[0] === 'audio' || mimeParts[0] === 'video' || mimeParts[0] === 'image') {
        return mimeParts[1]?.toUpperCase() || trimmed.toUpperCase()
      }
      return trimmed.toUpperCase()
    }
    // Handle extensions like ".mp3" -> "MP3"
    const clean = trimmed.replace('.', '').toUpperCase()
    return clean
  })

  return parts.join(', ')
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = (files: File[]) => {
  hasError.value = false
  errorMessage.value = ''

  // Validate file size
  const oversizedFiles = files.filter((file) => file.size > props.maxSize * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    hasError.value = true
    errorMessage.value = `File(s) too large. Maximum size is ${props.maxSize}MB.`
    return
  }

  // Validate file type
  if (props.accept !== '*/*') {
    const acceptedTypes = props.accept.split(',').map((type) => type.trim())
    const invalidFiles = files.filter((file) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      return !acceptedTypes.some(
        (type) => type === fileExtension || type === file.type || type === '*/*',
      )
    })

    if (invalidFiles.length > 0) {
      hasError.value = true
      errorMessage.value = 'Invalid file type. Please check accepted formats.'
      return
    }
  }

  // Process files
  if (props.multiple) {
    const currentFiles = Array.isArray(props.modelValue) ? props.modelValue : []
    const newFiles = [...currentFiles, ...files]
    emit('update:modelValue', newFiles)
    emit('upload', newFiles)
  } else {
    const file = files[0]

    // Create preview URL for audio/video files
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    if (isAudioFile(file) || isVideoFile(file)) {
      previewUrl.value = URL.createObjectURL(file)
      emit('update:previewUrl', previewUrl.value)
    } else {
      previewUrl.value = null
      emit('update:previewUrl', null)
    }

    emit('update:modelValue', file)
    emit('upload', file)
  }
}

const removeFile = (index?: number) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (typeof index === 'number') {
      const newFiles = props.modelValue.filter((_, i) => i !== index)
      emit('update:modelValue', newFiles.length > 0 ? newFiles : null)
    }
  } else {
    // Clean up preview URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      emit('update:previewUrl', null)
    }
    // Reset file input so the same file can be selected again
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    emit('update:modelValue', null)
  }
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return 'mdi:image'
  if (fileType.startsWith('video/')) return 'mdi:video'
  if (fileType.startsWith('audio/')) return 'mdi:music'
  if (fileType.includes('pdf')) return 'mdi:file-pdf-box'
  if (fileType.includes('word') || fileType.includes('document')) return 'mdi:file-word-box'
  if (fileType.includes('text')) return 'mdi:file-document'
  return 'mdi:file'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
