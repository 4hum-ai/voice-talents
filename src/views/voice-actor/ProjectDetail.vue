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
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ project?.title || 'Project Details' }}
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Project information and progress
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Button variant="outline" size="sm" @click="openMessages">
                <MessageIcon class="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="primary" size="sm" @click="viewAssignment" v-if="myAssignment">
                <ClipboardTextIcon class="h-4 w-4 mr-2" />
                View Assignment
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
              <!-- Project Overview -->
              <Card>
                <div class="p-6">
                  <div class="flex items-start justify-between mb-6">
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Project Overview
                      </h2>
                      <StatusBadge
                        :status="project?.status || 'pending'"
                        :variant="getStatusVariant(project?.status)"
                      />
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${{ project?.budget?.toLocaleString() }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Budget</p>
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <div>
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h3>
                      <p class="text-gray-900 dark:text-white">
                        {{ project?.description }}
                      </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Client
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ project?.clientName }}
                        </p>
                      </div>
                      
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Studio
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ project?.studioName || 'Not assigned' }}
                        </p>
                      </div>
                      
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Due Date
                        </h3>
                        <p class="text-gray-900 dark:text-white">
                          {{ formatDate(project?.dueDate) }}
                        </p>
                      </div>
                      
                      <div>
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Type
                        </h3>
                        <Chip
                          :label="project?.projectType || 'Unknown'"
                          variant="secondary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Assignment Details -->
              <Card v-if="myAssignment">
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    My Assignment
                  </h2>
                  
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Assignment Status
                      </h3>
                      <StatusBadge
                        :status="myAssignment.status"
                        :variant="getAssignmentStatusVariant(myAssignment.status)"
                      />
                    </div>
                    
                    <div v-if="myAssignment.description">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Instructions
                      </h3>
                      <p class="text-gray-900 dark:text-white">
                        {{ myAssignment.description }}
                      </p>
                    </div>
                    
                    <div v-if="myAssignment.recordingInstructions">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recording Instructions
                      </h3>
                      <p class="text-gray-900 dark:text-white">
                        {{ myAssignment.recordingInstructions }}
                      </p>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Due Date
                      </h3>
                      <p class="text-gray-900 dark:text-white">
                        {{ formatDate(myAssignment.dueDate) }}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Recent Messages -->
              <Card>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Messages
                    </h2>
                    <Button variant="outline" size="sm" @click="openMessages">
                      View All
                    </Button>
                  </div>
                  
                  <div class="space-y-4">
                    <div
                      v-for="message in recentMessages"
                      :key="message.id"
                      class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Avatar
                        :src="message.senderAvatar"
                        :alt="message.senderName"
                        size="sm"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 mb-1">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ message.senderName }}
                          </p>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatTimeAgo(message.timestamp) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                          {{ message.message }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
              <!-- Project Stats -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Project Stats
                  </h2>
                  
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ project?.progress || 0 }}%
                      </span>
                    </div>
                    
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${project?.progress || 0}%` }"
                      ></div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div class="text-center">
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">
                          {{ project?.assignments?.length || 0 }}
                        </p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Assignments</p>
                      </div>
                      <div class="text-center">
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">
                          {{ project?.messages?.length || 0 }}
                        </p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Messages</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Quick Actions -->
              <Card>
                <div class="p-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  
                  <div class="space-y-2">
                    <Button
                      variant="outline"
                      class="w-full justify-start"
                      @click="openMessages"
                    >
                      <MessageIcon class="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      v-if="myAssignment"
                      variant="outline"
                      class="w-full justify-start"
                      @click="viewAssignment"
                    >
                      <ClipboardTextIcon class="h-4 w-4 mr-2" />
                      View Assignment
                    </Button>
                    <Button
                      variant="outline"
                      class="w-full justify-start"
                      @click="downloadFiles"
                    >
                      <DownloadIcon class="h-4 w-4 mr-2" />
                      Download Files
                    </Button>
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
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import MessageIcon from '~icons/mdi/message'
import ClipboardTextIcon from '~icons/mdi/clipboard-text'
import DownloadIcon from '~icons/mdi/download'
import type { Project, ProjectAssignment } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.params.id as string)
const project = ref<Project | null>(null)
const myAssignment = ref<ProjectAssignment | null>(null)

const recentMessages = ref([
  {
    id: '1',
    senderName: 'Studio Producer',
    senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    message: 'Please review the updated script and let me know if you have any questions.',
    timestamp: '2023-07-15T10:30:00Z'
  },
  {
    id: '2',
    senderName: 'You',
    senderAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    message: 'I\'ve reviewed the script and everything looks good. I\'ll start recording tomorrow.',
    timestamp: '2023-07-14T15:45:00Z'
  }
])

onMounted(() => {
  // In real app, this would fetch from API
  project.value = mockData.projects.find(p => p.id === projectId.value) || null
  if (project.value) {
    myAssignment.value = project.value.assignments?.[0] || null
  }
})

const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'in-progress': return 'warning'
    case 'cancelled': return 'error'
    default: return 'secondary'
  }
}

const getAssignmentStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'in-progress': return 'warning'
    case 'pending': return 'secondary'
    default: return 'secondary'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const openMessages = () => {
  router.push(`/messages/${projectId.value}`)
}

const viewAssignment = () => {
  if (myAssignment.value) {
    router.push(`/projects/${projectId.value}/assignment/${myAssignment.value.id}`)
  }
}

const downloadFiles = () => {
  // In real app, this would download project files
  console.log('Downloading files for project:', projectId.value)
}
</script>

