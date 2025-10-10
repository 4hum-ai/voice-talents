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
              <div class="flex-shrink-0">
                <h1 class="text-2xl font-bold text-foreground">
                  Dashboard
                </h1>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="secondary" size="sm" @click="$router.push('/notifications')">
                <BellIcon class="h-4 w-4 mr-2" />
                Notifications
                <span v-if="unreadNotifications > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {{ unreadNotifications }}
                </span>
              </Button>
              <Button variant="primary" size="sm" @click="$router.push('/profile/edit')">
                <AccountIcon class="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-foreground mb-2">
            Welcome back, {{ currentActor?.displayName }}! 👋
          </h2>
          <p class="text-muted-foreground">
            Here's what's happening with your voice acting career today.
          </p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Projects"
            :value="stats.activeProjects"
            icon="folder-open"
            color="blue"
          />
          <MetricCard
            title="Total Earnings"
            :value="`$${stats.totalEarnings.toLocaleString()}`"
            icon="currency-usd"
            color="green"
          />
          <MetricCard
            title="Voice Samples"
            :value="stats.totalSamples"
            icon="microphone"
            color="purple"
          />
          <MetricCard
            title="Rating"
            :value="stats.averageRating.toFixed(1)"
            icon="star"
            color="yellow"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Recent Activity -->
            <Card>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/activity')">
                    View All
                  </Button>
                </div>
              </template>
              <div class="space-y-4">
                <div
                  v-for="activity in stats.recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon v-if="activity.icon && activity.icon.trim()" :name="activity.icon" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Icon v-else name="mdi:bell" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ activity.title }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatTimeAgo(activity.timestamp) }}
                    </p>
                  </div>
                  <div v-if="activity.status" class="flex-shrink-0">
                    <StatusBadge :status="mapActivityStatus(activity.status)" />
                  </div>
                </div>
              </div>
            </Card>

            <!-- Recent Projects -->
            <Card>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Projects
                  </h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/projects')">
                    View All
                  </Button>
                </div>
              </template>
              <div class="space-y-4">
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ project.title }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ project.clientName }}
                    </p>
                    <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ project.projectType }}</span>
                      <span>{{ formatDate(project.deadline) }}</span>
                      <span>{{ getProjectProgress(project) }}% complete</span>
                    </div>
                  </div>
                  <div class="flex-shrink-0 ml-4">
                    <StatusBadge :status="mapProjectStatus(project.status)" />
                  </div>
                  <div class="mt-3">
                    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{{ getProjectProgress(project) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${getProjectProgress(project)}%` }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <!-- Quick Actions -->
            <Card>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
              </template>
              <div class="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/samples/upload')"
                >
                  <Icon name="upload" class="h-4 w-4 mr-2" />
                  Upload Voice Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/casting')"
                >
                  <Icon name="search" class="h-4 w-4 mr-2" />
                  Browse Casting Calls
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/profile/edit')"
                >
                  <Icon name="account-edit" class="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </Card>

            <!-- Recent Messages -->
            <Card>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Messages
                  </h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/messages')">
                    View All
                  </Button>
                </div>
              </template>
              <div class="space-y-3">
                <div
                  v-for="message in recentMessages"
                  :key="message.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  @click="router.push(`/messages/${message.projectId}`)"
                >
                  <Avatar
                    :alt="message.senderName"
                    :seed="message.senderName"
                    size="sm"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ message.senderName }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ message.content }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTimeAgo(message.createdAt) }}
                    </p>
                  </div>
                  <div v-if="!message.isRead" class="flex-shrink-0">
                    <div class="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceActor, VoiceActorStats, Project, ProjectMessage } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Icon from '@/components/atoms/Icon.vue'
import BellIcon from '~icons/mdi/bell'
import AccountIcon from '~icons/mdi/account'

const router = useRouter()

// Mock data
const currentActor = ref<VoiceActor>(mockData.voiceActors[0])
const voiceActorStats = ref<VoiceActorStats>(mockData.voiceActorStats)

// Computed properties
const stats = computed(() => voiceActorStats.value)
const unreadNotifications = computed(() => 
  mockData.notifications.filter(n => !n.isRead).length
)

const recentProjects = computed(() => 
  mockData.projects.slice(0, 3)
)

const recentMessages = computed(() => 
  (mockData.projectMessages || []).slice(0, 3)
)

// Helper functions - Updated with error handling
const formatTimeAgo = (date: any): string => {
  try {
    console.log('formatTimeAgo called with:', date, 'type:', typeof date)
    if (!date) return 'Unknown'
    
    const now = new Date()
    let dateObj: Date
    
    if (typeof date === 'string') {
      dateObj = new Date(date)
    } else if (date instanceof Date) {
      dateObj = date
    } else {
      return 'Invalid date type'
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    
    const diff = now.getTime() - dateObj.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  } catch (error) {
    console.error('Error in formatTimeAgo:', error, 'date:', date)
    return 'Error formatting date'
  }
}

const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return 'Unknown'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getProjectProgress = (project: Project): number => {
  // Mock progress calculation
  return Math.floor(Math.random() * 100)
}

const mapProjectStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'assigned': 'pending',
    'in_progress': 'processing',
    'review': 'warning',
    'completed': 'success',
    'cancelled': 'error'
  }
  return statusMap[status] || 'pending'
}

const mapActivityStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'success',
    'pending': 'pending',
    'in_progress': 'processing',
    'failed': 'error'
  }
  return statusMap[status] || 'pending'
}

onMounted(() => {
  // Initialize dashboard data
  console.log('Dashboard mounted')
})
</script>