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
                Casting Opportunities
              </h1>
              <p class="text-sm text-muted-foreground">
                Discover and apply to voice acting projects
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <Button variant="outline" size="sm" @click="toggleView">
              <ViewGridIcon v-if="viewMode === 'list'" class="h-4 w-4 mr-2" />
              <ViewListIcon v-else class="h-4 w-4 mr-2" />
              {{ viewMode === 'list' ? 'Grid' : 'List' }}
            </Button>
            <Button variant="primary" size="sm" @click="refreshCasting">
              <RefreshIcon class="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
      <!-- Filters and Search -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search casting calls by title, client, or description..."
              @update:model-value="handleSearch"
            />
          </div>
          <div class="flex gap-2">
            <SelectInput
              v-model="selectedType"
              :options="typeOptions"
              placeholder="All Types"
              class="w-40"
            />
            <SelectInput
              v-model="selectedLanguage"
              :options="languageOptions"
              placeholder="All Languages"
              class="w-40"
            />
            <SelectInput
              v-model="selectedExperience"
              :options="experienceOptions"
              placeholder="All Experience"
              class="w-40"
            />
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Open Casting Calls"
          :value="openCastingCount"
          icon="mdi:megaphone"
          color="blue"
        />
        <MetricCard
          title="My Submissions"
          :value="mySubmissionsCount"
          icon="mdi:clipboard-check"
          color="green"
        />
        <MetricCard
          title="Shortlisted"
          :value="shortlistedCount"
          icon="mdi:star"
          color="yellow"
        />
        <MetricCard
          title="Selected"
          :value="selectedCount"
          icon="mdi:trophy"
          color="purple"
        />
      </div>

      <!-- Casting Calls Grid/List -->
      <div v-if="filteredCastingSessions.length === 0" class="text-center py-12">
        <MegaphoneIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-foreground mb-2">
          No casting calls found
        </h3>
        <p class="text-muted-foreground mb-6">
          {{ searchQuery ? 'Try adjusting your search criteria' : 'Check back later for new opportunities' }}
        </p>
        <Button variant="primary" @click="refreshCasting">
              <RefreshIcon class="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="session in filteredCastingSessions"
          :key="session.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Casting Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground mb-1">
                  {{ session.title }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ session.clientName }}
                </p>
                <p v-if="session.studioId" class="text-sm text-muted-foreground">
                  via {{ getStudioName(session.studioId) }}
                </p>
              </div>
              <div class="flex-shrink-0 ml-4">
                <StatusBadge :status="session.status" />
              </div>
            </div>
            
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ session.description }}
            </p>
          </div>

          <!-- Casting Details -->
          <div class="p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Type</span>
                <Chip size="sm" variant="secondary">
                  {{ formatProjectType(session.projectType) }}
                </Chip>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Budget</span>
                <span class="text-foreground font-medium">
                  ${{ session.budget?.min.toLocaleString() }} - ${{ session.budget?.max.toLocaleString() }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Deadline</span>
                <span class="text-foreground font-medium">
                  {{ formatDate(session.deadline) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Submissions</span>
                <span class="text-foreground font-medium">
                  {{ session.submissions.length }}
                </span>
              </div>
            </div>

            <!-- Requirements -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="text-xs text-muted-foreground mb-2">Requirements</div>
              <div class="flex flex-wrap gap-1">
                <Chip
                  v-for="language in session.requirements.languages"
                  :key="language"
                  size="sm"
                  variant="outline"
                >
                  {{ language }}
                </Chip>
                <Chip
                  v-for="voiceType in session.requirements.voiceTypes"
                  :key="voiceType"
                  size="sm"
                  variant="outline"
                >
                  {{ formatVoiceType(voiceType) }}
                </Chip>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6">
            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="$router.push(`/casting/${session.id}`)"
                >
                  <EyeIcon class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="shareCasting(session)"
                >
                  <ShareIcon class="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="primary"
                size="sm"
                @click="$router.push(`/casting/${session.id}/submit`)"
                :disabled="session.status !== 'open'"
              >
                <IconSend class="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Casting Call
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client / Studio
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budget
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Deadline
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="session in filteredCastingSessions"
                :key="session.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-foreground">
                      {{ session.title }}
                    </div>
                    <div class="text-sm text-muted-foreground line-clamp-2">
                      {{ session.description }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-foreground">
                    {{ session.clientName }}
                  </div>
                  <div v-if="session.studioId" class="text-sm text-muted-foreground">
                    {{ getStudioName(session.studioId) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Chip size="sm" variant="secondary">
                    {{ formatProjectType(session.projectType) }}
                  </Chip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  ${{ session.budget?.min.toLocaleString() }} - ${{ session.budget?.max.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {{ formatDate(session.deadline) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="session.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="$router.push(`/casting/${session.id}`)"
                    >
                      <EyeIcon class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      @click="$router.push(`/casting/${session.id}/submit`)"
                      :disabled="session.status !== 'open'"
                    >
                      <SendIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CastingSession } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Icon from '@/components/atoms/Icon.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ViewGridIcon from '~icons/mdi/view-grid'
import ViewListIcon from '~icons/mdi/view-list'
import RefreshIcon from '~icons/mdi/refresh'
import MegaphoneIcon from '~icons/mdi/megaphone'
import ClipboardCheckIcon from '~icons/mdi/clipboard-check'
import StarIcon from '~icons/mdi/star'
import TrophyIcon from '~icons/mdi/trophy'
import EyeIcon from '~icons/mdi/eye'
import ShareIcon from '~icons/mdi/share'
import SendIcon from '~icons/mdi/send'

const router = useRouter()

// State
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedType = ref('')
const selectedLanguage = ref('')
const selectedExperience = ref('')

// Mock data - in real app, this would come from API
const castingSessions = ref<CastingSession[]>(mockData.castingSessions)

// Computed
const filteredCastingSessions = computed(() => {
  let filtered = castingSessions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(session =>
      session.title.toLowerCase().includes(query) ||
      session.clientName.toLowerCase().includes(query) ||
      session.description.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(session => session.projectType === selectedType.value)
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(session => 
      session.requirements.languages.includes(selectedLanguage.value)
    )
  }

  if (selectedExperience.value) {
    filtered = filtered.filter(session => 
      session.requirements.experience === selectedExperience.value
    )
  }

  return filtered
})

const openCastingCount = computed(() =>
  castingSessions.value.filter(s => s.status === 'open').length
)

const mySubmissionsCount = computed(() => {
  // In real app, this would count actual submissions by current user
  return 3
})

const shortlistedCount = computed(() => {
  // In real app, this would count actual shortlisted submissions
  return 1
})

const selectedCount = computed(() => {
  // In real app, this would count actual selected submissions
  return 0
})

// Options for filters
const typeOptions = computed(() => [
  { value: '', label: 'All Types' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' }
])

const languageOptions = computed(() => [
  { value: '', label: 'All Languages' },
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' }
])

const experienceOptions = computed(() => [
  { value: '', label: 'All Experience' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
])

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleSearch = () => {
  // Search is handled by computed property
}

const refreshCasting = () => {
  // In real app, this would fetch fresh data from API
  console.log('Refreshing casting calls...')
}

const getStudioName = (studioId: string) => {
  const studio = mockData.studios.find(s => s.id === studioId)
  return studio?.name || 'Unknown Studio'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const shareCasting = (session: CastingSession) => {
  const url = `${window.location.origin}/casting/${session.id}`
  if (navigator.share) {
    navigator.share({
      title: session.title,
      text: session.description,
      url: url
    })
  } else {
    navigator.clipboard.writeText(url)
  }
}

onMounted(() => {
  // In real app, fetch casting sessions from API
  console.log('Casting view loaded with mock data')
})
</script>
