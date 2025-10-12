<template>
  <div class="file-upload">
    <!-- Upload Area -->
    <div
      class="border-border hover:border-primary/50 relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
      :class="{ 'border-primary bg-primary/5': isDragOver, 'border-destructive': hasError }"
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

      <div class="space-y-3">
        <div class="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon name="mdi:cloud-upload" class="text-muted-foreground h-6 w-6" />
        </div>

        <div>
          <p class="text-foreground text-sm font-medium">
            {{ isDragOver ? 'Drop files here' : 'Click to upload or drag and drop' }}
          </p>
          <p class="text-muted-foreground mt-1 text-xs">
            {{ acceptText }} (max {{ maxSize }}MB{{ multiple ? ' each' : '' }})
          </p>
        </div>

        <div v-if="premiumFeature" class="flex items-center justify-center space-x-2">
          <Icon name="mdi:star" class="text-primary h-4 w-4" />
          <span class="text-primary text-xs font-medium">Premium Feature</span>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="text-destructive mt-2 text-sm">
      {{ errorMessage }}
    </div>

    <!-- File Preview -->
    <div v-if="modelValue && !multiple" class="mt-3">
      <div class="bg-muted/50 flex items-center justify-between rounded-lg p-3">
        <div class="flex items-center space-x-3">
          <Icon
            :name="getFileIcon(Array.isArray(modelValue) ? modelValue[0]?.type : modelValue.type)"
            class="text-muted-foreground h-5 w-5"
          />
          <div>
            <p class="text-foreground text-sm font-medium">
              {{ Array.isArray(modelValue) ? `${modelValue.length} files` : modelValue.name }}
            </p>
            <p class="text-muted-foreground text-xs">
              {{
                Array.isArray(modelValue)
                  ? formatFileSize(modelValue.reduce((sum, file) => sum + file.size, 0))
                  : formatFileSize(modelValue.size)
              }}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          @click="() => removeFile()"
          class="text-destructive hover:text-destructive"
        >
          <Icon name="mdi:close" class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Multiple Files Preview -->
    <div v-if="modelValue && multiple && Array.isArray(modelValue)" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in modelValue"
        :key="index"
        class="bg-muted/50 flex items-center justify-between rounded-lg p-3"
      >
        <div class="flex items-center space-x-3">
          <Icon :name="getFileIcon(file.type)" class="text-muted-foreground h-5 w-5" />
          <div>
            <p class="text-foreground text-sm font-medium">{{ file.name }}</p>
            <p class="text-muted-foreground text-xs">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          @click="removeFile(index)"
          class="text-destructive hover:text-destructive"
        >
          <Icon name="mdi:close" class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  modelValue?: File | File[] | null
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
  premiumFeature?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  maxSize: 10,
  multiple: false,
  premiumFeature: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
  upload: [file: File | File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// Computed properties
const acceptText = computed(() => {
  if (props.accept === '*/*') return 'Any file type'

  const extensions = props.accept.split(',').map((ext) => {
    const clean = ext.trim().replace('.', '')
    return clean.toUpperCase()
  })

  return extensions.join(', ')
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
