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
                Notifications
              </h1>
              <p class="text-sm text-muted-foreground">
                Stay updated with your voice acting projects and opportunities
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              @click="markAllAsRead"
              :disabled="unreadCount === 0"
            >
              <CheckIcon class="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="primary" size="sm" @click="refreshNotifications">
              <RefreshIcon class="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Unread"
          :value="unreadCount"
          icon="mdi:bell"
          color="red"
        />
        <MetricCard
          title="Today"
          :value="todayCount"
          icon="mdi:calendar-today"
          color="blue"
        />
        <MetricCard
          title="This Week"
          :value="weekCount"
          icon="mdi:calendar-week"
          color="green"
        />
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <TabNavigation
          :tabs="filterTabs"
          :active-tab="activeFilter"
          @tab-change="setActiveFilter"
        />
      </div>

      <!-- Notifications List -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <BellIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-foreground mb-2">
          No notifications found
        </h3>
        <p class="text-muted-foreground">
          {{ getEmptyStateMessage() }}
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          :class="{ 'ring-2 ring-blue-500': !notification.isRead }"
        >
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <!-- Notification Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <Icon
                    :name="getNotificationIcon(notification.type)"
                    class="h-5 w-5"
                    :class="getNotificationIconColor(notification.type)"
                  />
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-foreground">
                      {{ notification.title }}
                    </h3>
                    <p class="text-sm text-muted-foreground mt-1">
                      {{ notification.message }}
                    </p>
                    
                    <!-- Notification Metadata -->
                    <div class="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                      <span class="flex items-center">
                        <ClockIcon class="h-3 w-3 mr-1" />
                        {{ formatTimeAgo(notification.createdAt) }}
                      </span>
                      <Chip
                        :variant="getPriorityVariant(notification.priority)"
                        size="sm"
                      >
                        {{ notification.priority }}
                      </Chip>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex items-center space-x-2 ml-4">
                    <div v-if="!notification.isRead" class="w-2 h-2 bg-blue-500 rounded-full" />
                    <ActionsMenu
                      :items="getNotificationActions(notification)"
                      size="sm"
                      @select="(action) => handleNotificationAction(action, notification)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="notification.actionUrl" class="px-6 pb-6">
            <div class="flex items-center space-x-3">
              <Button
                variant="primary"
                size="sm"
                @click="handleNotificationClick(notification)"
              >
                <ArrowRightIcon class="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="markAsRead(notification)"
                v-if="!notification.isRead"
              >
                <CheckIcon class="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNotifications" class="mt-8 text-center">
        <Button
          variant="outline"
          @click="loadMoreNotifications"
          :loading="isLoadingMore"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Load More
        </Button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Notification } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import Icon from '@/components/atoms/Icon.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import CheckIcon from '~icons/mdi/check'
import RefreshIcon from '~icons/mdi/refresh'
import BellIcon from '~icons/mdi/bell'
import CalendarTodayIcon from '~icons/mdi/calendar-today'
import CalendarWeekIcon from '~icons/mdi/calendar-week'
import ClockIcon from '~icons/mdi/clock'
import ArrowRightIcon from '~icons/mdi/arrow-right'
import PlusIcon from '~icons/mdi/plus'
import TrashIcon from '~icons/mdi/trash-can'
import ArchiveIcon from '~icons/mdi/archive'
import FlagIcon from '~icons/mdi/flag'

const router = useRouter()

// State
const activeFilter = ref('all')
const notifications = ref<Notification[]>(mockData.notifications)
const isLoadingMore = ref(false)

// Filter tabs
const filterTabs = [
  { id: 'all', label: 'All', count: 0 },
  { id: 'unread', label: 'Unread', count: 0 },
  { id: 'project', label: 'Projects', count: 0 },
  { id: 'casting', label: 'Casting', count: 0 },
  { id: 'payment', label: 'Payments', count: 0 },
  { id: 'system', label: 'System', count: 0 }
]

// Computed
const filteredNotifications = computed(() => {
  let filtered = notifications.value

  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.isRead)
      break
    case 'project':
      filtered = filtered.filter(n => 
        n.type.includes('project') || n.type.includes('assignment') || n.type.includes('recording')
      )
      break
    case 'casting':
      filtered = filtered.filter(n => n.type.includes('casting'))
      break
    case 'payment':
      filtered = filtered.filter(n => n.type.includes('payment'))
      break
    case 'system':
      filtered = filtered.filter(n => n.type.includes('system'))
      break
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.isRead).length
)

const todayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return notifications.value.filter(n => 
    new Date(n.createdAt) >= today
  ).length
})

const weekCount = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return notifications.value.filter(n => 
    new Date(n.createdAt) >= weekAgo
  ).length
})

const hasMoreNotifications = computed(() => {
  // In real app, this would check if there are more notifications to load
  return false
})

// Methods
const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
}

const markAsRead = async (notification: Notification) => {
  notification.isRead = true
  notification.readDate = new Date().toISOString()
  // In real app, this would call the API
}

const markAllAsRead = async () => {
  notifications.value.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true
      notification.readDate = new Date().toISOString()
    }
  })
  // In real app, this would call the API
}

const refreshNotifications = () => {
  // In real app, this would fetch fresh notifications from API
  console.log('Refreshing notifications...')
}

const loadMoreNotifications = () => {
  isLoadingMore.value = true
  // In real app, this would load more notifications
  setTimeout(() => {
    isLoadingMore.value = false
  }, 1000)
}

const getEmptyStateMessage = () => {
  switch (activeFilter.value) {
    case 'unread':
      return 'You have no unread notifications'
    case 'project':
      return 'No project-related notifications'
    case 'casting':
      return 'No casting-related notifications'
    case 'payment':
      return 'No payment-related notifications'
    case 'system':
      return 'No system notifications'
    default:
      return 'You have no notifications yet'
  }
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    project_assigned: 'folder-plus',
    project_updated: 'folder-edit',
    recording_submitted: 'microphone',
    recording_approved: 'check-circle',
    recording_rejected: 'close-circle',
    payment_received: 'currency-usd',
    message_received: 'message',
    deadline_reminder: 'clock-alert',
    casting_opportunity: 'megaphone',
    system_announcement: 'information'
  }
  return icons[type] || 'bell'
}

const getNotificationIconClass = (type: string) => {
  const classes: Record<string, string> = {
    project_assigned: 'bg-blue-100 dark:bg-blue-900',
    project_updated: 'bg-yellow-100 dark:bg-yellow-900',
    recording_submitted: 'bg-purple-100 dark:bg-purple-900',
    recording_approved: 'bg-green-100 dark:bg-green-900',
    recording_rejected: 'bg-red-100 dark:bg-red-900',
    payment_received: 'bg-green-100 dark:bg-green-900',
    message_received: 'bg-blue-100 dark:bg-blue-900',
    deadline_reminder: 'bg-orange-100 dark:bg-orange-900',
    casting_opportunity: 'bg-purple-100 dark:bg-purple-900',
    system_announcement: 'bg-gray-100 dark:bg-gray-700'
  }
  return classes[type] || 'bg-gray-100 dark:bg-gray-700'
}

const getNotificationIconColor = (type: string) => {
  const colors: Record<string, string> = {
    project_assigned: 'text-blue-600 dark:text-blue-400',
    project_updated: 'text-yellow-600 dark:text-yellow-400',
    recording_submitted: 'text-purple-600 dark:text-purple-400',
    recording_approved: 'text-green-600 dark:text-green-400',
    recording_rejected: 'text-red-600 dark:text-red-400',
    payment_received: 'text-green-600 dark:text-green-400',
    message_received: 'text-blue-600 dark:text-blue-400',
    deadline_reminder: 'text-orange-600 dark:text-orange-400',
    casting_opportunity: 'text-purple-600 dark:text-purple-400',
    system_announcement: 'text-gray-600 dark:text-gray-400'
  }
  return colors[type] || 'text-gray-600 dark:text-gray-400'
}

const getPriorityVariant = (priority: string) => {
  const variants: Record<string, string> = {
    low: 'secondary',
    medium: 'primary',
    high: 'warning'
  }
  return variants[priority] || 'secondary'
}

const getNotificationActions = (notification: Notification) => [
  {
    key: 'mark-read',
    label: notification.isRead ? 'Mark as Unread' : 'Mark as Read',
    icon: notification.isRead ? 'eye-off' : 'check'
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: 'archive'
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'trash',
    variant: 'danger' as const
  }
]

const handleNotificationAction = (action: string, notification: Notification) => {
  switch (action) {
    case 'mark-read':
      markAsRead(notification)
      break
    case 'archive':
      // Archive functionality
      break
    case 'delete':
      // Delete functionality
      break
  }
}

const handleNotificationClick = (notification: Notification) => {
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
  if (!notification.isRead) {
    markAsRead(notification)
  }
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return time.toLocaleDateString()
}

// Update filter tab counts
const updateFilterCounts = () => {
  filterTabs.forEach(tab => {
    switch (tab.id) {
      case 'all':
        tab.count = notifications.value.length
        break
      case 'unread':
        tab.count = unreadCount.value
        break
      case 'project':
        tab.count = notifications.value.filter(n => 
          n.type.includes('project') || n.type.includes('assignment') || n.type.includes('recording')
        ).length
        break
      case 'casting':
        tab.count = notifications.value.filter(n => n.type.includes('casting')).length
        break
      case 'payment':
        tab.count = notifications.value.filter(n => n.type.includes('payment')).length
        break
      case 'system':
        tab.count = notifications.value.filter(n => n.type.includes('system')).length
        break
    }
  })
}

onMounted(() => {
  updateFilterCounts()
  // In real app, fetch notifications from API
  console.log('Notifications view loaded with mock data')
})
</script>
