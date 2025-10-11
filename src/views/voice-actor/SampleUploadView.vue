<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  Upload Voice Sample
                </h1>
                <p class="text-sm text-muted-foreground">
                  Add a new voice sample to your portfolio
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Upload Form -->
            <div class="lg:col-span-2">
              <Card>
                <template #header>
                  <h3 class="text-lg font-semibold text-foreground">
                    Sample Details
                  </h3>
                </template>

                <EnhancedForm
                  :fields="formFields"
                  :initial-values="initialValues"
                  :loading="uploading"
                  submit-text="Upload Sample"
                  @submit="handleSubmit"
                  @cancel="handleCancel"
                />
              </Card>
            </div>

            <!-- Preview & Tips -->
            <div class="space-y-6">
              <!-- Audio Preview -->
              <Card v-if="audioFile">
                <template #header>
                  <h3 class="text-lg font-semibold text-foreground">
                    Audio Preview
                  </h3>
                </template>
                
                <EnhancedAudioPlayer
                  :audio-src="audioPreviewUrl"
                  :title="formData.title || 'Untitled Sample'"
                />
              </Card>

              <!-- Upload Tips -->
              <Card>
                <template #header>
                  <h3 class="text-lg font-semibold text-foreground">
                    Upload Tips
                  </h3>
                </template>
                
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-foreground">High Quality Audio</h4>
                      <p class="text-sm text-muted-foreground">Use professional recording equipment for best results</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-foreground">Clear Speech</h4>
                      <p class="text-sm text-muted-foreground">Speak clearly and at a consistent pace</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-foreground">Appropriate Length</h4>
                      <p class="text-sm text-muted-foreground">Keep samples between 30 seconds and 2 minutes</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-foreground">Diverse Content</h4>
                      <p class="text-sm text-muted-foreground">Showcase different styles and emotions</p>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- File Requirements -->
              <Card>
                <template #header>
                  <h3 class="text-lg font-semibold text-foreground">
                    File Requirements
                  </h3>
                </template>
                
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Supported Formats:</span>
                    <span class="text-foreground">MP3, WAV, OGG</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Max File Size:</span>
                    <span class="text-foreground">50 MB</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Recommended Length:</span>
                    <span class="text-foreground">30s - 2min</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Sample Rate:</span>
                    <span class="text-foreground">44.1 kHz or higher</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import EnhancedForm from '@/components/molecules/EnhancedForm.vue'
import EnhancedAudioPlayer from '@/components/organisms/EnhancedAudioPlayer.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'

const router = useRouter()
const { success, error } = useToast()

// State
const uploading = ref(false)
const audioFile = ref<File | null>(null)
const audioPreviewUrl = ref('')

// Form data
const formData = reactive({
  title: '',
  description: '',
  genre: '',
  tone: '',
  language: '',
  accent: '',
  tags: [],
  isPublic: true,
  audioFile: null as File | null,
})

// Initial values
const initialValues = computed(() => ({
  title: formData.title,
  description: formData.description,
  genre: formData.genre,
  tone: formData.tone,
  language: formData.language,
  accent: formData.accent,
  tags: formData.tags,
  isPublic: formData.isPublic,
  audioFile: formData.audioFile,
}))

// Form fields configuration
const formFields = [
  {
    name: 'title',
    type: 'text' as const,
    label: 'Sample Title',
    placeholder: 'Enter a descriptive title for your voice sample',
    required: true,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
  },
  {
    name: 'description',
    type: 'textarea' as const,
    label: 'Description',
    placeholder: 'Describe the content, style, and purpose of this sample',
    rows: 4,
    validation: {
      maxLength: 500,
    },
  },
  {
    name: 'genre',
    type: 'select' as const,
    label: 'Genre',
    placeholder: 'Select a genre',
    required: true,
    options: [
      { value: 'commercial', label: 'Commercial' },
      { value: 'audiobook', label: 'Audiobook' },
      { value: 'animation', label: 'Animation' },
      { value: 'video_game', label: 'Video Game' },
      { value: 'documentary', label: 'Documentary' },
      { value: 'e_learning', label: 'E-Learning' },
      { value: 'podcast', label: 'Podcast' },
      { value: 'ivr', label: 'IVR/Phone System' },
    ],
    validation: {
      required: true,
    },
  },
  {
    name: 'tone',
    type: 'select' as const,
    label: 'Tone/Emotion',
    placeholder: 'Select the tone',
    required: true,
    options: [
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'authoritative', label: 'Authoritative' },
      { value: 'warm', label: 'Warm' },
      { value: 'energetic', label: 'Energetic' },
      { value: 'calm', label: 'Calm' },
      { value: 'dramatic', label: 'Dramatic' },
      { value: 'playful', label: 'Playful' },
    ],
    validation: {
      required: true,
    },
  },
  {
    name: 'language',
    type: 'select' as const,
    label: 'Language',
    placeholder: 'Select language',
    required: true,
    options: [
      { value: 'English', label: 'English' },
      { value: 'Spanish', label: 'Spanish' },
      { value: 'French', label: 'French' },
      { value: 'German', label: 'German' },
      { value: 'Italian', label: 'Italian' },
      { value: 'Portuguese', label: 'Portuguese' },
      { value: 'Japanese', label: 'Japanese' },
      { value: 'Korean', label: 'Korean' },
      { value: 'Chinese', label: 'Chinese' },
    ],
    validation: {
      required: true,
    },
  },
  {
    name: 'accent',
    type: 'select' as const,
    label: 'Accent',
    placeholder: 'Select accent (optional)',
    options: [
      { value: 'american', label: 'American' },
      { value: 'british', label: 'British' },
      { value: 'australian', label: 'Australian' },
      { value: 'canadian', label: 'Canadian' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'southern', label: 'Southern' },
      { value: 'new_york', label: 'New York' },
      { value: 'california', label: 'California' },
    ],
  },
  {
    name: 'tags',
    type: 'multiselect' as const,
    label: 'Tags',
    description: 'Add relevant tags to help clients find your sample',
    options: [
      { value: 'male', label: 'Male Voice' },
      { value: 'female', label: 'Female Voice' },
      { value: 'young', label: 'Young Adult' },
      { value: 'mature', label: 'Mature' },
      { value: 'deep', label: 'Deep Voice' },
      { value: 'high', label: 'High Voice' },
      { value: 'fast', label: 'Fast Pace' },
      { value: 'slow', label: 'Slow Pace' },
      { value: 'clear', label: 'Clear Speech' },
      { value: 'expressive', label: 'Expressive' },
    ],
  },
  {
    name: 'audioFile',
    type: 'file' as const,
    label: 'Audio File',
    description: 'Upload your voice sample file',
    required: true,
    accept: 'audio/mp3,audio/wav,audio/ogg',
    validation: {
      required: true,
      custom: (value: File) => {
        if (!value) return 'Audio file is required'
        if (value.size > 50 * 1024 * 1024) return 'File size must be less than 50MB'
        const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg']
        if (!allowedTypes.includes(value.type)) return 'Only MP3, WAV, and OGG files are allowed'
        return null
      },
    },
  },
  {
    name: 'isPublic',
    type: 'checkbox' as const,
    label: 'Make this sample public',
    description: 'Public samples can be discovered by clients and casting directors',
  },
]

// Methods
const handleSubmit = async (values: Record<string, any>) => {
  uploading.value = true
  
  try {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update form data
    Object.assign(formData, values)
    
    success('Voice sample uploaded successfully!', 'Upload Complete')
    
    // Redirect to samples page
    router.push('/samples')
  } catch (err) {
    error('Failed to upload voice sample. Please try again.', 'Upload Failed')
  } finally {
    uploading.value = false
  }
}

const handleCancel = () => {
  router.push('/samples')
}

// Handle file changes for preview
// const handleFileChange = (field: string, value: File) => {
//   if (field === 'audioFile' && value) {
//     audioFile.value = value
//     audioPreviewUrl.value = URL.createObjectURL(value)
//   }
// }
</script>
