<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1 ml-72">
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
              <Button variant="outline" size="sm" @click="$router.back()">
                Cancel
              </Button>
              <Button variant="primary" size="sm" @click="uploadSample" :disabled="!isFormValid">
                Upload Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Upload Form -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Sample Information
              </h2>
              
              <div class="space-y-6">
                <FormInput
                  v-model="sample.title"
                  label="Sample Title"
                  placeholder="e.g., Commercial Demo - Energetic"
                  required
                />
                
                <Textarea
                  v-model="sample.description"
                  label="Description"
                  placeholder="Describe this voice sample..."
                  :rows="3"
                />
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Genres
                    </label>
                    <TagInput
                      v-model="sample.genre"
                      placeholder="Add genres (e.g., Commercial, Narration)"
                    />
                  </div>
                  
                  <SelectInput
                    v-model="sample.language"
                    label="Language"
                    :options="languageOptions"
                    placeholder="Select language"
                    required
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput
                    v-model="sample.accent"
                    label="Accent"
                    :options="accentOptions"
                    placeholder="Select accent (optional)"
                  />
                  
                  <SelectInput
                    v-model="sample.voiceType"
                    label="Voice Type"
                    :options="voiceTypeOptions"
                    placeholder="Select voice type (optional)"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <TagInput
                    v-model="sample.tags"
                    placeholder="Add descriptive tags"
                  />
                </div>
              </div>
            </div>
          </Card>

          <!-- File Upload -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Audio File
              </h2>
              
              <FileInput
                v-model="audioFile"
                accept="audio/*"
                label="Upload Audio File"
                description="Supported formats: MP3, WAV, OGG (Max 50MB)"
                @change="handleFileChange"
              />
              
              <div v-if="audioFile" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <MicrophoneIcon class="h-8 w-8 text-gray-400" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-foreground">
                      {{ audioFile.name }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ formatFileSize(audioFile.size) }}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" @click="removeFile">
                    <XIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <!-- Privacy Settings -->
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">
                Privacy Settings
              </h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">
                      Public Sample
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Make this sample visible to clients and casting directors
                    </p>
                  </div>
                  <Checkbox v-model="sample.isPublic" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">
                      Downloadable
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Allow clients to download this sample
                    </p>
                  </div>
                  <Checkbox v-model="sample.isDownloadable" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import TagInput from '@/components/atoms/TagInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import FileInput from '@/components/atoms/FileInput.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import MicrophoneIcon from '~icons/mdi/microphone'
import XIcon from '~icons/mdi/close'
import type { VoiceSample } from '@/types/voice-actor'

const router = useRouter()

// Form data
const sample = ref<Partial<VoiceSample>>({
  title: '',
  description: '',
  genre: [],
  language: '',
  accent: '',
  voiceType: '',
  tags: [],
  isPublic: true,
  isDownloadable: true
})

const audioFile = ref<File | null>(null)

const languageOptions = [
  { value: 'English (US)', label: 'English (US)' },
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' }
]

const accentOptions = [
  { value: 'Standard American', label: 'Standard American' },
  { value: 'British RP', label: 'British RP' },
  { value: 'Southern US', label: 'Southern US' },
  { value: 'New York', label: 'New York' },
  { value: 'Australian', label: 'Australian' },
  { value: 'Canadian', label: 'Canadian' }
]

const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'documentary', label: 'Documentary' }
]

const isFormValid = computed(() => {
  return sample.value.title && 
         sample.value.language && 
         audioFile.value
})

const handleFileChange = (file: File) => {
  audioFile.value = file
}

const removeFile = () => {
  audioFile.value = null
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadSample = () => {
  if (!isFormValid.value) return
  
  // In real app, this would upload to API
  console.log('Uploading sample:', { sample: sample.value, file: audioFile.value })
  router.push('/samples')
}
</script>

