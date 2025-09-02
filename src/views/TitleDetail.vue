<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <!-- Breadcrumbs -->
          <Breadcrumbs :items="breadcrumbs" />

          <!-- Title and Actions -->
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div v-if="title?.poster" class="flex-shrink-0">
                <Image
                  :src="title.poster"
                  :alt="title.name"
                  class="h-16 w-12 rounded-lg object-cover"
                />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ title?.name || 'Loading...' }}
                </h1>
                <p v-if="title?.year" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ title.year }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <button
                class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                @click="openDubbingEditor"
              >
                <Icon name="mdi:play-circle-outline" class="mr-2 h-4 w-4" />
                Start Dubbing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="border-primary-600 h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>

      <div v-else-if="error" class="py-12 text-center">
        <div class="text-lg text-red-600 dark:text-red-400">{{ error }}</div>
        <button class="text-primary-600 hover:text-primary-500 mt-4" @click="loadTitle">
          Try Again
        </button>
      </div>

      <div v-else-if="title" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="space-y-8 lg:col-span-2">
          <!-- Basic Info -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Basic Information
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldValue label="Title" :value="title.name" />
              <FieldValue label="Year" :value="title.year" />
              <FieldValue label="Type" :value="title.type" />
              <FieldValue label="Status" :value="title.status" formatter="status" />
              <FieldValue label="Language" :value="title.originalLanguage" formatter="language" />
              <FieldValue label="Duration" :value="title.duration" formatter="duration" />
            </div>
            <div v-if="title.description" class="mt-4">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p class="text-gray-600 dark:text-gray-400">{{ title.description }}</p>
            </div>
          </div>

          <!-- Dubbing Progress -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dubbing Progress
            </h2>
            <DubbingTab :title-id="titleId" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Poster Management -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Poster</h3>
            <div v-if="title.poster" class="mb-4">
              <Image
                :src="title.poster"
                :alt="title.name"
                class="h-64 w-full rounded-lg object-cover"
              />
            </div>
            <button
              class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="openPosterUpload"
            >
              {{ title.poster ? 'Change Poster' : 'Upload Poster' }}
            </button>
          </div>

          <!-- Quick Stats -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Stats</h3>
            <div class="space-y-3">
              <MetricCard
                title="Total Episodes"
                :value="title.episodeCount || 0"
                icon="mdi:playlist-play"
                icon-variant="primary"
              />
              <MetricCard
                title="Dubbing Languages"
                :value="dubbingLanguages.length"
                icon="mdi:translate"
                icon-variant="success"
              />
              <MetricCard
                title="Completion Rate"
                :value="completionRate"
                subtitle="%"
                icon="mdi:check-circle"
                icon-variant="success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Poster Upload Modal -->
    <FileUploadModal
      v-if="showPosterUpload"
      title="Upload Poster"
      :file-types="[{ extension: 'jpg', mimeType: 'image/jpeg', label: 'JPEG', icon: 'mdi:image' }]"
      :max-file-size="5 * 1024 * 1024"
      :max-files="1"
      :form-fields="posterFormFields"
      :upload-handler="handlePosterUpload"
      @close="showPosterUpload = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useApiGateway } from '@/utils/useApiGateway'
import Breadcrumbs from '@/components/molecules/Breadcrumbs.vue'
import Image from '@/components/molecules/Image.vue'
import FieldValue from '@/components/atoms/FieldValue.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import DubbingTab from '@/components/molecules/DubbingTab.vue'
import FileUploadModal from '@/components/molecules/FileUploadModal.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Title {
  id: string
  name: string
  year?: number
  type: string
  status: string
  originalLanguage: string
  duration?: number
  description?: string
  poster?: string
  episodeCount?: number
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const api = useApiGateway()

const titleId = route.params.id as string
const title = ref<Title | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showPosterUpload = ref(false)
const dubbingLanguages = ref<string[]>([])

// Poster upload form fields
const posterFormFields = () => [
  {
    key: 'type',
    label: 'Type',
    type: 'select' as const,
    value: 'poster',
    options: ['poster', 'banner', 'thumbnail'],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Enter poster description',
    value: '',
  },
]

// Computed properties
const breadcrumbs = computed(() => [
  { label: 'Titles', href: '/titles' },
  { label: title.value?.name || 'Loading...', href: `/titles/${titleId}` },
])

const completionRate = computed(() => {
  if (!dubbingLanguages.value.length) return 0
  // This would be calculated based on actual dubbing progress
  return Math.round((dubbingLanguages.value.length / 5) * 100) // Placeholder
})

// Methods
const loadTitle = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await api.get(`/titles/${titleId}`)
    const data = await response.json()
    title.value = data

    // Load dubbing languages (this would come from a separate endpoint)
    await loadDubbingLanguages()
  } catch (err) {
    error.value = 'Failed to load title'
    console.error('Error loading title:', err)
  } finally {
    loading.value = false
  }
}

const loadDubbingLanguages = async () => {
  try {
    // This would be a real API call
    dubbingLanguages.value = ['en', 'es', 'fr', 'de']
  } catch (err) {
    console.error('Error loading dubbing languages:', err)
  }
}

const openDubbingEditor = () => {
  if (dubbingLanguages.value.length > 0) {
    router.push(`/titles/${titleId}/dubbing/${dubbingLanguages.value[0]}`)
  } else {
    toast.push({
      id: 'no-languages',
      type: 'warning',
      body: 'No dubbing languages available',
      position: 'tr',
    })
  }
}

const openPosterUpload = () => {
  showPosterUpload.value = true
}

const handlePosterUpload = async (files: File[]) => {
  try {
    const file = files[0]
    if (!file) return

    // Upload poster via API
    const formData = new FormData()
    formData.append('poster', file)
    formData.append('titleId', titleId)

    await api.post(`/titles/${titleId}/poster`, formData)

    // Refresh title data
    await loadTitle()

    toast.push({
      id: 'poster-success',
      type: 'success',
      body: 'Poster uploaded successfully',
      position: 'tr',
    })
    showPosterUpload.value = false
  } catch (err) {
    toast.push({
      id: 'poster-error',
      type: 'error',
      body: 'Failed to upload poster',
      position: 'tr',
    })
    console.error('Error uploading poster:', err)
  }
}

// Lifecycle
onMounted(() => {
  loadTitle()
})
</script>
