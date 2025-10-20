<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Job Management</template>
        <template #subtitle>Manage your voice acting job postings</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="primary" size="sm" @click="openJobCreationModal">
            <PlusIcon class="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Live Jobs Section -->
          <div v-if="clientLiveJobs.length > 0" class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-foreground text-lg font-semibold">Live Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientLiveJobs.length }} job{{ clientLiveJobs.length !== 1 ? 's' : '' }}</span
              >
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="job in clientLiveJobs"
                :key="job.id"
                class="bg-card border-border hover:border-green-500/20 group rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
              >
                <!-- Status Badge -->
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span class="text-xs font-medium text-green-600 dark:text-green-400">LIVE</span>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ job.totalApplications || 0 }} applications</span>
                </div>

                <!-- Job Title -->
                <h3 class="text-foreground mb-2 text-base font-semibold line-clamp-2">
                  {{ job.title || 'Untitled Job' }}
                </h3>

                <!-- Key Info -->
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{ formatBudget(job.budget) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Deadline:</span>
                    <span class="text-foreground">{{ formatDeadline(job.deadline) }}</span>
                  </div>
                </div>

                <!-- Action Button -->
                <Button
                  variant="outline"
                  size="sm"
                  @click="viewLiveJob(job.id)"
                  class="w-full group-hover:bg-green-50 group-hover:border-green-200 group-hover:text-green-700 dark:group-hover:bg-green-950 dark:group-hover:border-green-800 dark:group-hover:text-green-300"
                >
                  <EyeIcon class="mr-2 h-4 w-4" />
                  View & Approve
                </Button>
              </div>
            </div>
          </div>

          <!-- Draft Jobs Section -->
          <div v-if="clientDrafts.length > 0" class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-foreground text-lg font-semibold">Draft Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientDrafts.length }} draft{{ clientDrafts.length !== 1 ? 's' : '' }}</span
              >
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="draft in clientDrafts"
                :key="draft.id"
                class="bg-card border-border hover:border-orange-500/20 group rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
              >
                <!-- Status Badge -->
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span class="text-xs font-medium text-orange-600 dark:text-orange-400">DRAFT</span>
                  </div>
                  <span class="text-xs text-muted-foreground">v{{ draft.version || 1 }}</span>
                </div>

                <!-- Job Title -->
                <h3 class="text-foreground mb-2 text-base font-semibold line-clamp-2">
                  {{ draft.title || 'Untitled Job' }}
                </h3>

                <!-- Key Info -->
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{ formatBudget(draft.budget) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Last saved:</span>
                    <span class="text-foreground">{{ formatDate(draft.lastSaved) }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="editDraft(draft.id)"
                    class="flex-1 group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-orange-700 dark:group-hover:bg-orange-950 dark:group-hover:border-orange-800 dark:group-hover:text-orange-300"
                  >
                    <EditIcon class="mr-2 h-4 w-4" />
                    Continue
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="confirmDiscardDraft(draft)"
                    class="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Jobs Section -->
          <div v-if="clientCompletedJobs.length > 0" class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-foreground text-lg font-semibold">Completed Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientCompletedJobs.length }} job{{ clientCompletedJobs.length !== 1 ? 's' : '' }}</span
              >
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="job in clientCompletedJobs"
                :key="job.id"
                class="bg-card border-border hover:border-blue-500/20 group rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
              >
                <!-- Status Badge -->
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400">COMPLETED</span>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ formatDate(job.closedDate || job.updatedAt) }}</span>
                </div>

                <!-- Job Title -->
                <h3 class="text-foreground mb-2 text-base font-semibold line-clamp-2">
                  {{ job.title || 'Untitled Job' }}
                </h3>

                <!-- Key Info -->
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{ formatBudget(job.budget) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Talent:</span>
                    <span class="text-foreground">{{ job.selectedTalents?.length || 0 }} selected</span>
                  </div>
                </div>

                <!-- Action Button -->
                <Button
                  variant="outline"
                  size="sm"
                  @click="downloadDelivery(job.id)"
                  class="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 dark:group-hover:bg-blue-950 dark:group-hover:border-blue-800 dark:group-hover:text-blue-300"
                >
                  <DownloadIcon class="mr-2 h-4 w-4" />
                  Download Delivery
                </Button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="clientDrafts.length === 0 && clientLiveJobs.length === 0 && clientCompletedJobs.length === 0"
            class="py-12 text-center"
          >
            <BriefcaseIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">No Jobs Yet</h3>
            <p class="text-muted-foreground mb-6">
              Start creating your first job posting or save a draft to continue later
            </p>
            <Button variant="primary" @click="openJobCreationModal">
              <PlusIcon class="mr-2 h-4 w-4" />
              Create Your First Job
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Creation Modal -->
    <JobCreationModal
      :open="showJobCreationModal"
      :draft-id="selectedDraftId || undefined"
      @close="closeJobCreationModal"
      @complete="handleJobCreated"
    />

    <!-- Confirmation Modal -->
    <ConfirmModal
      :open="showDiscardModal"
      title="Discard Draft"
      :message="`Are you sure you want to discard '${draftToDiscard?.title || 'Untitled Job'}'? This action cannot be undone.`"
      confirm-label="Discard"
      cancel-label="Cancel"
      @confirm="discardDraft"
      @cancel="cancelDiscard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import JobCreationModal from '@/components/organisms/JobCreationModal.vue'
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { mockClientData } from '@/data/mock-voice-client-data'
import PlusIcon from '~icons/mdi/plus'
import BriefcaseIcon from '~icons/mdi/briefcase'
import EditIcon from '~icons/mdi/pencil'
import TrashIcon from '~icons/mdi/trash-can'
import EyeIcon from '~icons/mdi/eye'
import DownloadIcon from '~icons/mdi/download'

// const router = useRouter() // Not needed with modal approach
const { deleteDraft, getDraftsByClient, getPublishedJobsByClient, getCompletedJobsByClient, refreshJobs } = useJob()
const { addToast: showToast } = useToast()

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Filter jobs for current client
const clientDrafts = computed(() => {
  return getDraftsByClient(currentClient.value.id)
})

const clientLiveJobs = computed(() => {
  return getPublishedJobsByClient(currentClient.value.id)
})

const clientCompletedJobs = computed(() => {
  return getCompletedJobsByClient(currentClient.value.id)
})

// Modal state
const showJobCreationModal = ref(false)
const selectedDraftId = ref<string | null>(null)

// Confirmation modal state
const showDiscardModal = ref(false)
const draftToDiscard = ref<any>(null)

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 168) {
    // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Edit draft
const editDraft = (draftId: string) => {
  selectedDraftId.value = draftId
  showJobCreationModal.value = true
}

// Confirm discard draft
const confirmDiscardDraft = (draft: any) => {
  draftToDiscard.value = draft
  showDiscardModal.value = true
}

// Discard draft
const discardDraft = () => {
  if (draftToDiscard.value) {
    const success = deleteDraft(draftToDiscard.value.id)
    if (success) {
      showToast({
        type: 'success',
        title: 'Draft Discarded',
        message: `"${draftToDiscard.value.title || 'Untitled Job'}" has been discarded.`,
      })
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to discard draft. Please try again.',
      })
    }
  }
  showDiscardModal.value = false
  draftToDiscard.value = null
}

// Cancel discard
const cancelDiscard = () => {
  showDiscardModal.value = false
  draftToDiscard.value = null
}

// Job creation modal methods
const openJobCreationModal = () => {
  selectedDraftId.value = null
  showJobCreationModal.value = true
}

const closeJobCreationModal = () => {
  showJobCreationModal.value = false
  selectedDraftId.value = null
}

const handleJobCreated = (job: any) => {
  showToast({
    type: 'success',
    title: 'Job Published',
    message: `"${job.title}" has been published successfully!`,
  })
  closeJobCreationModal()

  // Refresh the jobs list to show the updated status
  refreshJobs()
}

// View live job for approval
const viewLiveJob = (_jobId: string) => {
  // In a real app, this would navigate to job applications view
  showToast({
    type: 'info',
    title: 'View Applications',
    message: 'Job applications view would open here for talent approval',
  })
}

// Download delivery for completed jobs
const downloadDelivery = (_jobId: string) => {
  // In a real app, this would trigger download of completed deliverables
  showToast({
    type: 'success',
    title: 'Download Started',
    message: 'Downloading completed job deliverables...',
  })
}

// Formatting functions
const formatJobType = (_jobType: string) => {
  return _jobType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const formatBudget = (budget: any) => {
  if (!budget || !budget.max) return 'Not set'
  const symbol = getCurrencySymbol(budget.currency)
  return `${symbol}${budget.max.toLocaleString()}`
}

const formatDeadline = (deadline: string) => {
  if (!deadline) return 'Not set'
  const date = new Date(deadline)
  const now = new Date()
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) return 'Overdue'
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays <= 7) return `${diffInDays} days`
  return date.toLocaleDateString()
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  return symbols[currency] || '$'
}
</script>
