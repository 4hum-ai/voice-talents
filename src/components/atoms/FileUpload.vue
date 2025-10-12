<template>
  <div class="file-upload">
    <!-- Upload Area -->
    <div 
      class="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
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
        <div class="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
          <Icon name="mdi:cloud-upload" class="h-6 w-6 text-muted-foreground" />
        </div>
        
        <div>
          <p class="text-sm font-medium text-foreground">
            {{ isDragOver ? 'Drop files here' : 'Click to upload or drag and drop' }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ acceptText }} (max {{ maxSize }}MB{{ multiple ? ' each' : '' }})
          </p>
        </div>
        
        <div v-if="premiumFeature" class="flex items-center justify-center space-x-2">
          <Icon name="mdi:star" class="h-4 w-4 text-primary" />
          <span class="text-xs text-primary font-medium">Premium Feature</span>
        </div>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="hasError" class="mt-2 text-sm text-destructive">
      {{ errorMessage }}
    </div>
    
    <!-- File Preview -->
    <div v-if="modelValue && !multiple" class="mt-3">
      <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div class="flex items-center space-x-3">
          <Icon :name="getFileIcon(modelValue.type)" class="h-5 w-5 text-muted-foreground" />
          <div>
            <p class="text-sm font-medium text-foreground">{{ modelValue.name }}</p>
            <p class="text-xs text-muted-foreground">{{ formatFileSize(modelValue.size) }}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          @click="removeFile"
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
        class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <Icon :name="getFileIcon(file.type)" class="h-5 w-5 text-muted-foreground" />
          <div>
            <p class="text-sm font-medium text-foreground">{{ file.name }}</p>
            <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
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
  premiumFeature: false
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
  'upload': [file: File | File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// Computed properties
const acceptText = computed(() => {
  if (props.accept === '*/*') return 'Any file type'
  
  const extensions = props.accept.split(',').map(ext => {
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
  const oversizedFiles = files.filter(file => file.size > props.maxSize * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    hasError.value = true
    errorMessage.value = `File(s) too large. Maximum size is ${props.maxSize}MB.`
    return
  }
  
  // Validate file type
  if (props.accept !== '*/*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const invalidFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      return !acceptedTypes.some(type => 
        type === fileExtension || 
        type === file.type ||
        type === '*/*'
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
