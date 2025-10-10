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
                  {{ sample?.title || 'Voice Sample' }}
                </h1>
                <p class="text-sm text-muted-foreground">
                  Voice sample details and analytics
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="outline" size="sm" @click="$router.push(`/samples/${sampleId}/edit`)">
                <EditIcon class="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="primary" size="sm" @click="shareSample">
                <ShareIcon class="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Audio Player -->
              <Card>
                <div class="p-6">
                  <VoiceSamplePlayer
                    :sample="sample"
                    :audioUrl="sample?.audioUrl"
                    :waveformUrl="sample?.waveformUrl"
                  />
                </div>
              </Card>

              <!-- Sample Information -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sample Information
                  </h2>
                  
                  <div class="space-y-4">
                    <div v-if="sample?.description">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h3>
                      <p class="text-gray-900 dark:text-white">
                        {{ sample.description }}
                      </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ formatDuration(sample?.duration || 0) }}
                        </p>
                      </div>
                      
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ sample?.language }}
                        </p>
                      </div>
                      
                      <div v-if="sample?.accent">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Accent
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ sample.accent }}
                        </p>
                      </div>
                      
                      <div v-if="sample?.voiceType">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Voice Type
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ sample.voiceType }}
                        </p>
                      </div>
                    </div>
                    
                    <div v-if="sample?.genre?.length">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Genres
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <Chip
                          v-for="genre in sample.genre"
                          :key="genre"
                          :label="genre"
                          variant="secondary"
                        />
                      </div>
                    </div>
                    
                    <div v-if="sample?.tags?.length">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <Chip
                          v-for="tag in sample.tags"
                          :key="tag"
                          :label="tag"
                          variant="outline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Analytics -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Analytics
                  </h2>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                      title="Total Plays"
                      :value="sample?.playCount?.toLocaleString() || '0'"
                      icon="mdi:play"
                      color="blue"
                    />
                    <MetricCard
                      title="Downloads"
                      :value="sample?.downloadCount?.toLocaleString() || '0'"
                      icon="mdi:download"
                      color="green"
                    />
                    <MetricCard
                      title="Shares"
                      :value="sample?.shareCount?.toLocaleString() || '0'"
                      icon="mdi:share"
                      color="purple"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
              <!-- Status & Actions -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Status & Actions
                  </h2>
                  
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Visibility
                      </span>
                      <StatusBadge
                        :status="sample?.isPublic ? 'public' : 'private'"
                        :variant="sample?.isPublic ? 'success' : 'secondary'"
                      />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verified
                      </span>
                      <div v-if="sample?.isVerified" class="flex items-center text-green-600">
                        <CheckIcon class="h-4 w-4 mr-1" />
                        <span class="text-sm">Verified</span>
                      </div>
                      <span v-else class="text-sm text-gray-500">Not verified</span>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div class="space-y-2">
                        <Button
                          variant="outline"
                          class="w-full justify-start"
                          @click="downloadSample"
                        >
                          <DownloadIcon class="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          class="w-full justify-start"
                          @click="copyLink"
                        >
                          <CopyIcon class="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          class="w-full justify-start"
                          @click="deleteSample"
                        >
                          <TrashIcon class="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Recent Activity -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h2>
                  
                  <div class="space-y-3">
                    <div
                      v-for="activity in recentActivity"
                      :key="activity.id"
                      class="flex items-start space-x-3"
                    >
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <ClockIcon class="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 dark:text-white">
                          {{ activity.description }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatTimeAgo(activity.timestamp) }}
                        </p>
                      </div>
                    </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import VoiceSamplePlayer from '@/components/organisms/VoiceSamplePlayer.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import EditIcon from '~icons/mdi/pencil'
import ShareIcon from '~icons/mdi/share'
import DownloadIcon from '~icons/mdi/download'
import CopyIcon from '~icons/mdi/content-copy'
import TrashIcon from '~icons/mdi/trash-can'
import CheckIcon from '~icons/mdi/check'
import ClockIcon from '~icons/mdi/clock'
import type { VoiceSample } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const router = useRouter()

const sampleId = computed(() => route.params.id as string)
const sample = ref<VoiceSample | null>(null)

const recentActivity = ref([
  {
    id: '1',
    description: 'Sample played by client',
    timestamp: '2023-07-15T10:30:00Z'
  },
  {
    id: '2',
    description: 'Sample downloaded',
    timestamp: '2023-07-14T15:45:00Z'
  },
  {
    id: '3',
    description: 'Sample shared',
    timestamp: '2023-07-13T09:20:00Z'
  }
])

onMounted(() => {
  // In real app, this would fetch from API
  sample.value = mockData.voiceSamples.find(s => s.id === sampleId.value) || null
})

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

const shareSample = () => {
  // In real app, this would open share dialog
  console.log('Sharing sample:', sample.value?.id)
}

const downloadSample = () => {
  // In real app, this would trigger download
  console.log('Downloading sample:', sample.value?.id)
}

const copyLink = () => {
  // In real app, this would copy link to clipboard
  console.log('Copying link for sample:', sample.value?.id)
}

const deleteSample = () => {
  // In real app, this would show confirmation dialog and delete
  console.log('Deleting sample:', sample.value?.id)
  router.push('/samples')
}
</script>

