<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click', project)"
  >
    <!-- Project Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ project.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ project.clientName }}
          </p>
          <p v-if="project.studioName" class="text-sm text-gray-500 dark:text-gray-400">
            via {{ project.studioName }}
          </p>
        </div>
        <div class="flex-shrink-0 ml-4">
          <StatusBadge :status="mapProjectStatus(project.status)" />
        </div>
      </div>
      
      <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {{ project.description }}
      </p>
    </div>

    <!-- Project Details -->
    <div class="p-6">
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Type</span>
          <Chip size="sm" variant="secondary">
            {{ formatProjectType(project.projectType) }}
          </Chip>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Budget</span>
          <span class="text-gray-900 dark:text-white font-medium">
            ${{ project.budget?.toLocaleString() }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Deadline</span>
          <span class="text-gray-900 dark:text-white font-medium">
            {{ formatDate(project.deadline) }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Priority</span>
          <Chip
            :variant="getPriorityVariant(project.priority)"
            size="sm"
          >
            {{ formatPriority(project.priority) }}
          </Chip>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-4">
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

      <!-- Assignment Info -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Your Assignment</span>
          <StatusBadge
            :status="mapAssignmentStatus(getMyAssignmentStatus(project))"
            :variant="getAssignmentStatusVariant(getMyAssignmentStatus(project))"
          />
        </div>
        
        <!-- Assignment Details -->
        <div v-if="myAssignment" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center justify-between">
            <span>Role: {{ myAssignment.role }}</span>
            <span>Due: {{ formatDate(myAssignment.dueDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Requirements -->
      <div v-if="showRequirements" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Requirements</div>
        <div class="flex flex-wrap gap-1">
          <Chip
            v-for="language in project.requirements.languages"
            :key="language"
            size="sm"
            variant="outline"
          >
            {{ language }}
          </Chip>
          <Chip
            v-for="voiceType in project.requirements.voiceTypes"
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
            @click.stop="$emit('view', project)"
          >
            <EyeIcon class="h-4 w-4" />
          </Button>
          <Button
            v-if="myAssignment"
            variant="ghost"
            size="sm"
            @click.stop="$emit('assignment', project, myAssignment)"
          >
            <ClipboardTextIcon class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click.stop="$emit('messages', project)"
          >
            <MessageIcon class="h-4 w-4" />
          </Button>
        </div>
        <ActionsMenu
          :items="getProjectActions(project)"
          size="sm"
          @select="(action) => $emit('action', action, project)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project, ProjectAssignment } from '@/types/voice-actor'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import EyeIcon from '~icons/mdi/eye'
import ClipboardTextIcon from '~icons/mdi/clipboard-text'
import MessageIcon from '~icons/mdi/message'

interface Props {
  project: Project
  showRequirements?: boolean
  currentActorId?: string
}

const props = withDefaults(defineProps<Props>(), {
  showRequirements: false,
  currentActorId: 'va-001' // Mock current actor ID
})

const emit = defineEmits<{
  click: [project: Project]
  view: [project: Project]
  assignment: [project: Project, assignment: ProjectAssignment]
  messages: [project: Project]
  action: [action: string, project: Project]
}>()

// Computed
const myAssignment = computed(() => {
  return props.project.assignedActors.find(
    assignment => assignment.voiceActorId === props.currentActorId
  )
})

// Methods
const getProjectProgress = (project: Project) => {
  const assignments = project.assignedActors
  if (assignments.length === 0) return 0
  
  const completed = assignments.filter(a => a.status === 'completed').length
  return Math.round((completed / assignments.length) * 100)
}

const getMyAssignmentStatus = (project: Project) => {
  const assignment = myAssignment.value
  return assignment?.status || 'not_assigned'
}

const getPriorityVariant = (priority: string) => {
  const variants: Record<string, string> = {
    low: 'soft',
    medium: 'solid',
    high: 'soft',
    urgent: 'solid'
  }
  return variants[priority] || 'soft'
}

const getAssignmentStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    assigned: 'soft',
    accepted: 'solid',
    in_progress: 'soft',
    submitted: 'soft',
    review: 'soft',
    approved: 'solid',
    completed: 'solid',
    cancelled: 'solid',
    not_assigned: 'soft'
  }
  return variants[status] || 'soft'
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

const formatPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatVoiceType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

const mapProjectStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'open': 'active',
    'in_progress': 'processing',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'on_hold': 'pending'
  }
  return statusMap[status] || 'active'
}

const mapAssignmentStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'assigned': 'pending',
    'accepted': 'active',
    'in_progress': 'processing',
    'submitted': 'pending',
    'review': 'pending',
    'approved': 'success',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'not_assigned': 'inactive'
  }
  return statusMap[status] || 'inactive'
}

const getProjectActions = (project: Project) => [
  {
    key: 'share',
    label: 'Share Project',
    icon: 'share'
  },
  {
    key: 'download-files',
    label: 'Download Files',
    icon: 'download'
  },
  {
    key: 'calendar',
    label: 'Add to Calendar',
    icon: 'calendar'
  },
  {
    key: 'archive',
    label: 'Archive Project',
    icon: 'archive',
    variant: 'danger' as const
  }
]
</script>
