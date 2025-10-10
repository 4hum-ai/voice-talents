<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Voice Sample
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Update your voice sample information
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="outline" size="sm" @click="$router.back()">
                Cancel
              </Button>
              <Button variant="primary" size="sm" @click="saveSample">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Sample Information -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
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

          <!-- Current Audio File -->
          <Card class="mb-8">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Current Audio File
              </h2>
              
              <div class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <MicrophoneIcon class="h-8 w-8 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ sample.title }}.mp3
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Duration: {{ formatDuration(sample.duration || 0) }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <Button variant="outline" size="sm" @click="playCurrentAudio">
                    <PlayIcon class="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm" @click="replaceAudio">
                    <UploadIcon class="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <!-- Privacy Settings -->
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Privacy Settings
              </h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      Public Sample
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      Make this sample visible to clients and casting directors
                    </p>
                  </div>
                  <Checkbox v-model="sample.isPublic" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      Downloadable
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import TagInput from '@/components/atoms/TagInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import MicrophoneIcon from '~icons/mdi/microphone'
import PlayIcon from '~icons/mdi/play'
import UploadIcon from '~icons/mdi/upload'
import type { VoiceSample } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const router = useRouter()

const sampleId = computed(() => route.params.id as string)
const sample = ref<VoiceSample | null>(null)

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

onMounted(() => {
  // In real app, this would fetch from API
  const foundSample = mockData.voiceSamples.find(s => s.id === sampleId.value)
  if (foundSample) {
    sample.value = { ...foundSample }
  }
})

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const playCurrentAudio = () => {
  // In real app, this would play the current audio
  console.log('Playing current audio for sample:', sample.value?.id)
}

const replaceAudio = () => {
  // In real app, this would open file picker to replace audio
  console.log('Replacing audio for sample:', sample.value?.id)
}

const saveSample = () => {
  if (!sample.value) return
  
  // In real app, this would save to API
  console.log('Saving sample:', sample.value)
  router.push(`/samples/${sampleId.value}`)
}
</script>

