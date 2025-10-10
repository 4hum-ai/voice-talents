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
                My Projects
              </h1>
              <p class="text-sm text-muted-foreground">
                Track your voice acting projects and assignments
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" @click="toggleView">
              <ViewGridIcon v-if="viewMode === 'list'" class="h-4 w-4 mr-2" />
              <ViewListIcon v-else class="h-4 w-4 mr-2" />
              {{ viewMode === 'list' ? 'Grid' : 'List' }}
            </Button>
            <Button variant="primary" size="sm" @click="$router.push('/casting')">
              <MagnifyIcon class="h-4 w-4 mr-2" />
              Find Projects
            </Button>
          </div>
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
              placeholder="Search projects by title, client, or studio..."
              @update:model-value="handleSearch"
            />
          </div>
          <div class="flex gap-2">
            <SelectInput
              v-model="selectedStatus"
              :options="statusOptions"
              placeholder="All Statuses"
              class="w-40"
            />
            <SelectInput
              v-model="selectedType"
              :options="typeOptions"
              placeholder="All Types"
              class="w-40"
            />
            <SelectInput
              v-model="selectedPriority"
              :options="priorityOptions"
              placeholder="All Priorities"
              class="w-40"
            />
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Projects"
          :value="filteredProjects.length"
          icon="mdi:folder-open"
          color="blue"
        />
        <MetricCard
          title="Active Projects"
          :value="activeProjectsCount"
          icon="play"
          color="green"
        />
        <MetricCard
          title="Completed"
          :value="completedProjectsCount"
          icon="mdi:check"
          color="purple"
        />
        <MetricCard
          title="Total Earnings"
          :value="`$${totalEarnings.toLocaleString()}`"
          icon="mdi:currency-usd"
          color="orange"
        />
      </div>

      <!-- Projects Grid/List -->
      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <FolderOpenIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-foreground mb-2">
          No projects found
        </h3>
        <p class="text-muted-foreground mb-6">
          {{ searchQuery ? 'Try adjusting your search criteria' : 'Start by browsing casting opportunities' }}
        </p>
        <Button variant="primary" @click="$router.push('/casting')">
              <MagnifyIcon class="h-4 w-4 mr-2" />
          Browse Casting Calls
        </Button>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/projects/${project.id}`)"
        >
          <!-- Project Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground mb-1">
                  {{ project.title }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ project.clientName }}
                </p>
                <p v-if="project.studioName" class="text-sm text-muted-foreground">
                  via {{ project.studioName }}
                </p>
              </div>
              <div class="flex-shrink-0 ml-4">
                <StatusBadge :status="project.status" />
              </div>
            </div>
            
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ project.description }}
            </p>
          </div>

          <!-- Project Details -->
          <div class="p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Type</span>
                <span class="text-foreground font-medium">
                  {{ project.projectType }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Budget</span>
                <span class="text-foreground font-medium">
                  ${{ project.budget?.toLocaleString() }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Deadline</span>
                <span class="text-foreground font-medium">
                  {{ formatDate(project.deadline) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Priority</span>
                <Chip
                  :variant="getPriorityVariant(project.priority)"
                  size="sm"
                >
                  {{ project.priority }}
                </Chip>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
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

            <!-- Assignment Info -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Your Assignment</span>
                <StatusBadge
                  :status="getMyAssignmentStatus(project)"
                  :variant="getAssignmentStatusVariant(getMyAssignmentStatus(project))"
                />
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
                  @click.stop="$router.push(`/projects/${project.id}`)"
                >
                  <EyeIcon class="h-4 w-4" />
                </Button>
                <Button
                  v-if="getMyAssignment(project)"
                  variant="ghost"
                  size="sm"
                  @click.stop="$router.push(`/projects/${project.id}/assignment/${getMyAssignment(project)?.id}`)"
                >
                  <ClipboardTextIcon class="h-4 w-4" />
                </Button>
              </div>
              <ActionsMenu
                :items="getProjectActions(project)"
                size="sm"
                @select="(action) => handleProjectAction(action, project)"
              />
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
                  Project
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
                v-for="project in filteredProjects"
                :key="project.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                @click="$router.push(`/projects/${project.id}`)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-foreground">
                      {{ project.title }}
                    </div>
                    <div class="text-sm text-muted-foreground line-clamp-2">
                      {{ project.description }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-foreground">
                    {{ project.clientName }}
                  </div>
                  <div v-if="project.studioName" class="text-sm text-muted-foreground">
                    {{ project.studioName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Chip size="sm" variant="secondary">
                    {{ project.projectType }}
                  </Chip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  ${{ project.budget?.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {{ formatDate(project.deadline) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <StatusBadge :status="project.status" />
                    <StatusBadge
                      :status="getMyAssignmentStatus(project)"
                      :variant="getAssignmentStatusVariant(getMyAssignmentStatus(project))"
                      size="sm"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click.stop="$router.push(`/projects/${project.id}`)"
                    >
                      <EyeIcon class="h-4 w-4" />
                    </Button>
                    <Button
                      v-if="getMyAssignment(project)"
                      variant="ghost"
                      size="sm"
                      @click.stop="$router.push(`/projects/${project.id}/assignment/${getMyAssignment(project)?.id}`)"
                    >
                      <ClipboardTextIcon class="h-4 w-4" />
                    </Button>
                    <ActionsMenu
                      :items="getProjectActions(project)"
                      size="sm"
                      @select="(action) => handleProjectAction(action, project)"
                    />
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
import type { Project, ProjectAssignment } from '@/types/voice-actor'
import { mockData } from '@/data/mock-voice-actor-data'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import ViewGridIcon from '~icons/mdi/view-grid'
import ViewListIcon from '~icons/mdi/view-list'
import MagnifyIcon from '~icons/mdi/magnify'
import FolderOpenIcon from '~icons/mdi/folder-open'
import EyeIcon from '~icons/mdi/eye'
import ClipboardTextIcon from '~icons/mdi/clipboard-text'
import MessageIcon from '~icons/mdi/message'
import ShareIcon from '~icons/mdi/share'
import ArchiveIcon from '~icons/mdi/archive'

const router = useRouter()

// State
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const selectedPriority = ref('')

// Mock data - in real app, this would come from API
const projects = ref<Project[]>(mockData.projects)

// Computed
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.clientName.toLowerCase().includes(query) ||
      project.studioName?.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.status === selectedStatus.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(project => project.projectType === selectedType.value)
  }

  if (selectedPriority.value) {
    filtered = filtered.filter(project => project.priority === selectedPriority.value)
  }

  return filtered
})

const activeProjectsCount = computed(() =>
  projects.value.filter(p => p.status === 'in_progress').length
)

const completedProjectsCount = computed(() =>
  projects.value.filter(p => p.status === 'completed').length
)

const totalEarnings = computed(() =>
  projects.value.reduce((sum, project) => sum + (project.budget || 0), 0)
)

// Options for filters
const statusOptions = computed(() => [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'on_hold', label: 'On Hold' }
])

const typeOptions = computed(() => [
  { value: '', label: 'All Types' },
  ...Array.from(new Set(projects.value.map(p => p.projectType))).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }))
])

const priorityOptions = computed(() => [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
])

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleSearch = () => {
  // Search is handled by computed property
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getProjectProgress = (project: Project) => {
  const assignments = project.assignedActors
  if (assignments.length === 0) return 0
  
  const completed = assignments.filter(a => a.status === 'completed').length
  return Math.round((completed / assignments.length) * 100)
}

const getMyAssignment = (project: Project): ProjectAssignment | undefined => {
  // In real app, this would filter by current user ID
  return project.assignedActors.find(a => a.voiceActorId === 'va-001')
}

const getMyAssignmentStatus = (project: Project) => {
  const assignment = getMyAssignment(project)
  return assignment?.status || 'not_assigned'
}

const getPriorityVariant = (priority: string) => {
  const variants: Record<string, string> = {
    low: 'secondary',
    medium: 'primary',
    high: 'warning',
    urgent: 'danger'
  }
  return variants[priority] || 'secondary'
}

const getAssignmentStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    assigned: 'secondary',
    accepted: 'primary',
    in_progress: 'warning',
    submitted: 'info',
    review: 'warning',
    approved: 'success',
    completed: 'success',
    cancelled: 'danger',
    not_assigned: 'secondary'
  }
  return variants[status] || 'secondary'
}

const getProjectActions = (project: Project) => [
  {
    key: 'messages',
    label: 'View Messages',
    icon: 'message'
  },
  {
    key: 'share',
    label: 'Share Project',
    icon: 'share'
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: 'archive',
    variant: 'danger' as const
  }
]

const handleProjectAction = (action: string, project: Project) => {
  switch (action) {
    case 'messages':
      router.push(`/messages/${project.id}`)
      break
    case 'share':
      // Share functionality
      break
    case 'archive':
      // Archive functionality
      break
  }
}

onMounted(() => {
  // In real app, fetch projects from API
  console.log('Projects view loaded with mock data')
})
</script>
