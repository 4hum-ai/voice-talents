<template>
  <div class="w-full">
    <label v-if="label" :for="fileInputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="space-y-2">
      <!-- File input button -->
      <div class="relative">
        <input
          :id="fileInputId"
          ref="fileInputRef"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :class="inputClasses"
          @change="handleFileChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />

        <!-- Custom file input button -->
        <button type="button" :disabled="disabled" :class="buttonClasses" @click="triggerFileInput">
          <IconCloudUpload class="mr-2 h-4 w-4" />
          {{ buttonText }}
        </button>
      </div>

      <!-- File preview/status -->
      <div v-if="uploading" class="text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center">
          <div
            class="mr-2 h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent"
          ></div>
          Uploading...
        </div>
      </div>

      <div
        v-else-if="modelValue && typeof modelValue === 'string'"
        class="rounded bg-gray-50 p-2 text-xs break-all text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <div class="flex items-center justify-between">
          <span class="truncate">{{ getFileName(modelValue) }}</span>
          <button type="button" class="ml-2 text-red-500 hover:text-red-700" @click="clearFile">
            ✕
          </button>
        </div>
      </div>

      <!-- Error message (shown first if present) -->
      <p v-if="error" :class="errorClasses">
        {{ error }}
      </p>

      <!-- Help text (shown only if no error) -->
      <p v-if="helpText && !error" :class="helpTextClasses">
        {{ helpText }}
      </p>
    </div>

    <!-- FileUploadModal integration -->
    <FileUploadModal
      v-if="showUploadModal"
      :title="modalTitle"
      :accept="accept"
      :max-files="multiple ? maxFiles : 1"
      :form-fields="formFields"
      @close="closeUploadModal"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FileUploadModal from '@/components/molecules/FileUploadModal.vue'
import { useMedia } from '@/composables/useMedia'
import { useToast } from '@/lib/toast'
import IconCloudUpload from '~icons/mdi/cloud-upload'
import {
  generateInputId,
  getValidationState,
  getLabelClasses,
  getHelpTextClasses,
  getErrorClasses,
  getBorderClasses,
  type BaseFormInputProps,
} from '../util/BaseFormInput'

interface Props extends BaseFormInputProps {
  modelValue: string | undefined
  /** Accepted file types */
  accept?: string
  /** Whether to allow multiple files */
  multiple?: boolean
  /** Maximum number of files */
  maxFiles?: number
  /** Button text */
  buttonText?: string
  /** Modal title */
  modalTitle?: string
  /** Use modal for file selection */
  useModal?: boolean
  /** Form fields for modal */
  formFields?: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'textarea' | 'tags'
    required?: boolean
    options?: string[]
    placeholder?: string
    value?: string | string[]
  }>
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  multiple: false,
  maxFiles: 1,
  size: 'md',
  validationState: 'default',
  buttonText: 'Choose File',
  modalTitle: 'Upload File',
  useModal: false,
  formFields: () => [
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      value: 'poster',
      options: ['poster', 'thumbnail', 'banner', 'logo', 'other'],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
      value: '',
    },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const showUploadModal = ref(false)
const uploading = ref(false)

const { uploadViaMediaResource } = useMedia()
const { push } = useToast()

const fileInputId = generateInputId('file-input')

const effectiveValidationState = computed(() =>
  getValidationState(props.error, props.validationState),
)

const inputClasses = computed(() => {
  const base = 'sr-only' // Hide the actual file input
  return base
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center border shadow-sm leading-4 font-medium rounded-md text-foreground bg-input hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const borderClasses = getBorderClasses(effectiveValidationState.value).replace(
    'border ',
    'border-2 ',
  )

  return `${base} ${sizes[props.size]} ${borderClasses}`
})

const labelClasses = computed(() => getLabelClasses(props.size))
const helpTextClasses = computed(() => getHelpTextClasses(props.size))
const errorClasses = computed(() => getErrorClasses(props.size))

const triggerFileInput = () => {
  if (props.useModal) {
    showUploadModal.value = true
  } else {
    fileInputRef.value?.click()
  }
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await uploadViaMediaResource(file, { type: 'poster' })
    emit('update:modelValue', result.fileUrl)
    push({
      id: `${Date.now()}-file-upload` as string,
      type: 'success',
      title: 'Upload complete',
      body: `${file.name} uploaded`,
      position: 'tr',
      timeout: 4000,
    })
  } catch (err: unknown) {
    push({
      id: `${Date.now()}-file-upload-err` as string,
      type: 'error',
      title: 'Upload failed',
      body: (err as Error)?.message || 'Unable to upload file',
      position: 'tr',
      timeout: 6000,
    })
  } finally {
    uploading.value = false
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const handleUploaded = () => {
  showUploadModal.value = false
  // The modal handles the upload, so we just close it
  // The parent component should handle updating the modelValue
}

const clearFile = () => {
  emit('update:modelValue', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const getFileName = (url: string) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    return pathname.split('/').pop() || url
  } catch {
    return url
  }
}
</script>
