<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar>
        <template #title>Dashboard</template>
        <template #subtitle
          >Welcome back! Here's what's happening with your voice acting career today.</template
        >
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-foreground mb-2 text-3xl font-bold">
            Welcome back, {{ currentActor?.displayName }}! 👋
          </h2>
          <p class="text-muted-foreground">
            Here's what's happening with your voice acting career today.
          </p>
        </div>

        <!-- Enhanced Stats Overview -->
        <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="group">
            <MetricCard
              title="Active Projects"
              :value="stats.activeProjects"
              icon="mdi:folder-open"
              icon-variant="primary"
              :trend="{ value: 12, direction: 'up', period: 'vs last month' }"
              class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            />
          </div>
          <div class="group">
            <MetricCard
              title="Total Earnings"
              :value="`$${stats.totalEarnings.toLocaleString()}`"
              icon="mdi:currency-usd"
              icon-variant="success"
              :trend="{ value: 8, direction: 'up', period: 'vs last month' }"
              class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            />
          </div>

          <div class="group">
            <MetricCard
              title="Rating"
              :value="stats.averageRating.toFixed(1)"
              icon="mdi:star"
              icon-variant="error"
              :trend="{ value: 0.2, direction: 'up', period: 'vs last month' }"
              class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Left Column -->
          <div class="space-y-8 lg:col-span-2">
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
                  class="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="flex-shrink-0">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
                    >
                      <Icon
                        v-if="activity.icon && activity.icon.trim()"
                        :name="activity.icon"
                        class="h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                      <Icon
                        v-else
                        name="mdi:bell"
                        class="h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
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
                  <Button variant="ghost" size="sm" @click="$router.push('/talent/projects')">
                    View All
                  </Button>
                </div>
              </template>
              <div class="space-y-4">
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="flex items-start justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ project.title }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ project.clientName }}
                    </p>
                    <div
                      class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <span>{{ project.projectType }}</span>
                      <span>{{ formatDate(project.deadline) }}</span>
                      <span>{{ getProjectProgress(project) }}% complete</span>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <StatusBadge :status="mapProjectStatus(project.status)" />
                  </div>
                  <div class="mt-3">
                    <div
                      class="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                    >
                      <span>Progress</span>
                      <span>{{ getProjectProgress(project) }}%</span>
                    </div>
                    <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        class="h-2 rounded-full bg-blue-600 transition-all duration-300"
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              </template>
              <div class="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/talent/profile/edit')"
                >
                  <Icon name="upload" class="h-4 w-4" />
                  Upload Voice Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/talent/casting')"
                >
                  <Icon name="search" class="h-4 w-4" />
                  Browse Casting Calls
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full justify-start"
                  @click="$router.push('/talent/profile/edit')"
                >
                  <Icon name="account-edit" class="h-4 w-4" />
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
                  class="flex cursor-pointer items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  @click="router.push(`/messages/${message.projectId}`)"
                >
                  <Avatar :alt="message.senderName" :seed="message.senderName" size="sm" />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ message.senderName }}
                    </p>
                    <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                      {{ message.content }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTimeAgo(message.createdAt) }}
                    </p>
                  </div>
                  <div v-if="!message.isRead" class="flex-shrink-0">
                    <div class="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Talent Onboarding -->
    <OnboardingFlow
      :show="showTalentOnboarding"
      @complete="completeTalentOnboarding"
      @skip="skipTalentOnboarding"
      @close="closeTalentOnboarding"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceActor, VoiceActorStats } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import { useOnboarding } from '@/composables/useOnboarding'
import { useToast } from '@/composables/useToast'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import OnboardingFlow from '@/components/organisms/OnboardingFlow.vue'

const router = useRouter()

// Onboarding logic
const { shouldShowOnboarding, isTalentMode, setUserMode } = useOnboarding()
const { success } = useToast()

// Mock data
const currentActor = ref<VoiceActor>(mockData.voiceActors[0])
const voiceActorStats = ref<VoiceActorStats>(mockData.voiceActorStats)

// Computed properties
const stats = computed(() => voiceActorStats.value)
const showTalentOnboarding = computed(() => isTalentMode.value && shouldShowOnboarding.value)

const recentProjects = computed(() => mockData.projects.slice(0, 3))

const recentMessages = computed(() => (mockData.projectMessages || []).slice(0, 3))

// Helper functions - Updated with error handling
const formatTimeAgo = (date: string | Date | null | undefined): string => {
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
    day: 'numeric',
  })
}

const getProjectProgress = (): number => {
  // Mock progress calculation
  return Math.floor(Math.random() * 100)
}

const mapProjectStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    assigned: 'pending',
    in_progress: 'processing',
    review: 'warning',
    completed: 'success',
    cancelled: 'error',
  }
  return statusMap[status] || 'pending'
}

const mapActivityStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: 'success',
    pending: 'pending',
    in_progress: 'processing',
    failed: 'error',
  }
  return statusMap[status] || 'pending'
}

// Onboarding methods
const completeTalentOnboarding = () => {
  success('Welcome to VoiceAct! Your talent profile is ready to go.')
}

const skipTalentOnboarding = () => {
  success('You can complete your profile later in settings.')
}

const closeTalentOnboarding = () => {
  // Onboarding will be hidden automatically by the computed property
}

onMounted(() => {
  // Set user mode to talent when accessing talent dashboard
  setUserMode('talent')

  // Initialize dashboard data
  console.log('Talent dashboard mounted')
})
</script>
