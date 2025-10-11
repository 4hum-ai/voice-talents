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
                  Voice Samples
                </h1>
                <p class="text-sm text-muted-foreground">
                  Manage your voice portfolio and showcase your talent
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" @click="toggleView">
                <ViewGridIcon v-if="viewMode === 'list'" class="h-4 w-4" />
                <ViewListIcon v-else class="h-4 w-4" />
                {{ viewMode === 'list' ? 'Grid' : 'List' }}
              </Button>
              <Button variant="primary" size="sm" @click="$router.push('/samples/upload')">
                <PlusIcon class="h-4 w-4" />
                Upload Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Enhanced Search and Filters -->
        <div class="mb-8">
          <AdvancedSearch
            placeholder="Search voice samples by title, genre, or tags..."
            :filters="{
              category: true,
              type: true,
              status: true,
              dateRange: true,
              tags: true
            }"
            :category-options="genreOptions"
            :type-options="toneOptions"
            :status-options="languageOptions"
            :available-tags="availableTags"
            :results-count="filteredSamples.length"
            @search="handleAdvancedSearch"
            @filter-change="handleFilterChange"
          />
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Samples" :value="filteredSamples.length" icon="mdi:microphone" color="blue" />
          <MetricCard title="Public Samples" :value="publicSamplesCount" icon="mdi:eye" color="green" />
          <MetricCard title="Total Plays" :value="totalPlays.toLocaleString()" icon="mdi:play" color="purple" />
          <MetricCard title="Downloads" :value="totalDownloads.toLocaleString()" icon="mdi:download" color="orange" />
        </div>

        <!-- Samples Grid/List -->
        <div v-if="filteredSamples.length === 0" class="text-center py-12">
          <MicrophoneIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-foreground mb-2">
            No samples found
          </h3>
          <p class="text-muted-foreground mb-6">
            {{ searchQuery ? 'Try adjusting your search criteria' : 'Upload your first voice sample to get started' }}
          </p>
          <Button variant="primary" @click="$router.push('/samples/upload')">
            <PlusIcon class="h-4 w-4" />
            Upload Sample
          </Button>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="sample in filteredSamples" :key="sample.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push(`/samples/${sample.id}`)">
            <!-- Sample Thumbnail -->
            <div class="aspect-video bg-gray-100 dark:bg-gray-700 relative">
              <img v-if="sample.thumbnailUrl" :src="sample.thumbnailUrl" :alt="sample.title"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MicrophoneIcon class="h-8 w-8 text-gray-400" />
              </div>

              <!-- Play Button Overlay -->
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <div class="bg-white rounded-full p-3">
                  <PlayIcon class="h-6 w-6 text-gray-900" />
                </div>
              </div>

              <!-- Duration Badge -->
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ formatDuration(sample.duration) }}
              </div>

              <!-- Verified Badge -->
              <div v-if="sample.isVerified" class="absolute top-2 right-2">
                <div class="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckIcon class="h-3 w-3 mr-1" />
                  Verified
                </div>
              </div>
            </div>

            <!-- Sample Info -->
            <div class="p-4">
              <h3 class="font-medium text-foreground mb-1 truncate">
                {{ sample.title }}
              </h3>
              <p class="text-sm text-muted-foreground mb-2 line-clamp-2">
                {{ sample.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1 mb-3">
                <Chip v-for="tag in sample.tags.slice(0, 3)" :key="tag" size="sm" variant="secondary">
                  {{ tag }}
                </Chip>
                <Chip v-if="sample.tags.length > 3" size="sm" variant="secondary">
                  +{{ sample.tags.length - 3 }}
                </Chip>
              </div>

              <!-- Stats -->
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <PlayIcon class="h-3 w-3 mr-1" />
                    {{ sample.playCount.toLocaleString() }}
                  </span>
                  <span class="flex items-center">
                    <DownloadIcon class="h-3 w-3 mr-1" />
                    {{ sample.downloadCount }}
                  </span>
                </div>
                <div class="flex items-center">
                  <Icon :name="sample.isPublic ? 'eye' : 'eye-off'" class="h-3 w-3" />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-4 pb-4">
              <div class="flex items-center justify-between">
                <div class="flex space-x-2">
                  <Button variant="ghost" size="sm" @click.stop="playSample(sample)">
                    <PlayIcon class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click.stop="$router.push(`/samples/${sample.id}/edit`)">
                    <EditIcon class="h-4 w-4" />
                  </Button>
                </div>
                <ActionsMenu :items="getSampleActions(sample)" size="sm"
                  @select="(action) => handleSampleAction(action, sample)" />
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sample
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Genre / Tone
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stats
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="sample in filteredSamples" :key="sample.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  @click="$router.push(`/samples/${sample.id}`)">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-12 w-12">
                        <img v-if="sample.thumbnailUrl" :src="sample.thumbnailUrl" :alt="sample.title"
                          class="h-12 w-12 rounded-lg object-cover" />
                        <div v-else
                          class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <MicrophoneIcon class="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-foreground">
                          {{ sample.title }}
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {{ sample.language }} • {{ sample.accent }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-foreground">
                      {{ sample.genre }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ sample.tone }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {{ formatDuration(sample.duration) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-foreground">
                      {{ sample.playCount.toLocaleString() }} plays
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ sample.downloadCount }} downloads
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <StatusBadge :status="sample.isPublic ? 'public' : 'private'"
                        :variant="sample.isPublic ? 'success' : 'secondary'" />
                      <div v-if="sample.isVerified" class="flex items-center text-green-600">
                        <CheckIcon class="h-4 w-4" />
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" @click.stop="playSample(sample)">
                        <PlayIcon class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" @click.stop="$router.push(`/samples/${sample.id}/edit`)">
                        <EditIcon class="h-4 w-4" />
                      </Button>
                      <ActionsMenu :items="getSampleActions(sample)" size="sm"
                        @select="(action) => handleSampleAction(action, sample)" />
                    </div>
                  </td>
                </tr>F
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceSample } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import AdvancedSearch from '@/components/molecules/AdvancedSearch.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ViewGridIcon from '~icons/mdi/view-grid'
import ViewListIcon from '~icons/mdi/view-list'
import PlusIcon from '~icons/mdi/plus'
import MicrophoneIcon from '~icons/mdi/microphone'
import PlayIcon from '~icons/mdi/play'
import DownloadIcon from '~icons/mdi/download'
import EditIcon from '~icons/mdi/pencil'
import CheckIcon from '~icons/mdi/check'
import EyeIcon from '~icons/mdi/eye'
import EyeOffIcon from '~icons/mdi/eye-off'
import TrashIcon from '~icons/mdi/trash-can'
import ShareIcon from '~icons/mdi/share'
import CopyIcon from '~icons/mdi/content-copy'

const router = useRouter()

// State
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedGenre = ref('')
const selectedTone = ref('')
const selectedLanguage = ref('')
const availableTags = ref(['English', 'Spanish', 'Commercial', 'Narration', 'Male', 'Female', 'Animation', 'Video Game'])

// Mock data
const samples = ref<VoiceSample[]>(mockData.voiceSamples)

// Computed
const filteredSamples = computed(() => {
  let filtered = samples.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(sample =>
      sample.title.toLowerCase().includes(query) ||
      sample.description?.toLowerCase().includes(query) ||
      sample.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (selectedGenre.value) {
    filtered = filtered.filter(sample => sample.genre === selectedGenre.value)
  }

  if (selectedTone.value) {
    filtered = filtered.filter(sample => sample.tone === selectedTone.value)
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(sample => sample.language === selectedLanguage.value)
  }

  return filtered
})

const publicSamplesCount = computed(() =>
  samples.value.filter(s => s.isPublic).length
)

const totalPlays = computed(() =>
  samples.value.reduce((sum, sample) => sum + sample.playCount, 0)
)

const totalDownloads = computed(() =>
  samples.value.reduce((sum, sample) => sum + sample.downloadCount, 0)
)

// Options for filters
const genreOptions = computed(() => [
  { value: '', label: 'All Genres' },
  ...Array.from(new Set(samples.value.map(s => s.genre))).map(genre => ({
    value: genre,
    label: genre.charAt(0).toUpperCase() + genre.slice(1)
  }))
])

const toneOptions = computed(() => [
  { value: '', label: 'All Tones' },
  ...Array.from(new Set(samples.value.map(s => s.tone))).map(tone => ({
    value: tone,
    label: tone.charAt(0).toUpperCase() + tone.slice(1)
  }))
])

const languageOptions = computed(() => [
  { value: '', label: 'All Languages' },
  ...Array.from(new Set(samples.value.map(s => s.language))).map(lang => ({
    value: lang,
    label: lang
  }))
])

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleAdvancedSearch = (query: string, filters: any) => {
  searchQuery.value = query
  // Handle advanced search logic here
  console.log('Advanced search:', { query, filters })
}

const handleFilterChange = (filters: any) => {
  // Handle filter changes
  console.log('Filter change:', filters)
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const playSample = (sample: VoiceSample) => {
  // In real app, this would open the audio player
  console.log('Playing sample:', sample.title)
}

const getSampleActions = (sample: VoiceSample) => [
  {
    key: 'share',
    label: 'Share Sample',
    icon: 'share'
  },
  {
    key: 'copy-link',
    label: 'Copy Link',
    icon: 'copy'
  },
  {
    key: 'download',
    label: 'Download',
    icon: 'download'
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'trash',
    variant: 'danger' as const
  }
]

const handleSampleAction = (action: string, sample: VoiceSample) => {
  switch (action) {
    case 'share':
      // Share functionality
      break
    case 'copy-link':
      // Copy link functionality
      break
    case 'download':
      // Download functionality
      break
    case 'delete':
      // Delete functionality
      break
  }
}

onMounted(() => {
  // In real app, fetch samples from API
  console.log('Samples view loaded with mock data')
})
</script>
