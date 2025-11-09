<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <!-- List View -->
      <div v-if="viewMode === 'list'">
        <!-- Live Jobs Section -->
        <div v-if="clientLiveJobs.length > 0" class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <button
              @click="toggleGroup('live')"
              class="hover:text-primary flex items-center space-x-2 text-left"
            >
              <ChevronDownIcon
                v-if="!collapsedGroups.has('live')"
                class="h-4 w-4 transition-transform"
              />
              <ChevronRightIcon v-else class="h-4 w-4 transition-transform" />
              <h2 class="text-foreground text-lg font-semibold">Live Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientLiveJobs.length }} job{{ clientLiveJobs.length !== 1 ? 's' : '' }}</span
              >
            </button>
          </div>

          <div v-if="!collapsedGroups.has('live')" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="job in clientLiveJobs"
              :key="job.id"
              class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-green-500/20 hover:shadow-md"
            >
              <!-- Job Title -->
              <h3 class="text-foreground mb-2 line-clamp-2 text-base font-semibold">
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
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Applications:</span>
                  <span class="text-foreground">{{ job.totalApplications || 0 }}</span>
                </div>
              </div>

              <!-- Action Button -->
              <Button
                icon="mdi:eye"
                variant="outline"
                size="sm"
                @click="viewLiveJob(job.id)"
                class="w-full group-hover:border-green-200 group-hover:bg-green-50 group-hover:text-green-700 dark:group-hover:border-green-800 dark:group-hover:bg-green-950 dark:group-hover:text-green-300"
              >
                View & Approve
              </Button>
            </div>
          </div>
        </div>

        <!-- Draft Jobs Section -->
        <div v-if="clientDrafts.length > 0" class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <button
              @click="toggleGroup('drafts')"
              class="hover:text-primary flex items-center space-x-2 text-left"
            >
              <ChevronDownIcon
                v-if="!collapsedGroups.has('drafts')"
                class="h-4 w-4 transition-transform"
              />
              <ChevronRightIcon v-else class="h-4 w-4 transition-transform" />
              <h2 class="text-foreground text-lg font-semibold">Draft Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientDrafts.length }} draft{{ clientDrafts.length !== 1 ? 's' : '' }}</span
              >
            </button>
          </div>

          <div
            v-if="!collapsedGroups.has('drafts')"
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="draft in clientDrafts"
              :key="draft.id"
              class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-orange-500/20 hover:shadow-md"
            >
              <!-- Job Title -->
              <h3 class="text-foreground mb-2 line-clamp-2 text-base font-semibold">
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
                  <span class="text-foreground">{{
                    formatDate(draft.lastSaved || draft.updatedAt)
                  }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Version:</span>
                  <span class="text-foreground">v{{ draft.version || 1 }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:pencil"
                  @click="editDraft(draft.id)"
                  class="flex-1 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-700 dark:group-hover:border-orange-800 dark:group-hover:bg-orange-950 dark:group-hover:text-orange-300"
                >
                  Continue
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="mdi:trash-can"
                  @click="confirmDiscardDraft(draft)"
                  class="text-destructive hover:text-destructive hover:bg-destructive/10"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Jobs Section -->
        <div v-if="clientCompletedJobs.length > 0" class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <button
              @click="toggleGroup('completed')"
              class="hover:text-primary flex items-center space-x-2 text-left"
            >
              <ChevronDownIcon
                v-if="!collapsedGroups.has('completed')"
                class="h-4 w-4 transition-transform"
              />
              <ChevronRightIcon v-else class="h-4 w-4 transition-transform" />
              <h2 class="text-foreground text-lg font-semibold">Completed Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientCompletedJobs.length }} job{{
                  clientCompletedJobs.length !== 1 ? 's' : ''
                }}</span
              >
            </button>
          </div>

          <div
            v-if="!collapsedGroups.has('completed')"
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="job in clientCompletedJobs"
              :key="job.id"
              class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md"
            >
              <!-- Job Title -->
              <h3 class="text-foreground mb-2 line-clamp-2 text-base font-semibold">
                {{ job.title || 'Untitled Job' }}
              </h3>

              <!-- Key Info -->
              <div class="mb-3 space-y-1 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Budget:</span>
                  <span class="text-foreground font-medium">{{ formatBudget(job.budget) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Completed:</span>
                  <span class="text-foreground">{{
                    formatDate(job.closedDate || job.updatedAt)
                  }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Talent:</span>
                  <span class="text-foreground"
                    >{{ job.selectedTalents?.length || 0 }} selected</span
                  >
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:download"
                  @click="downloadDelivery(job.id)"
                  class="flex-1 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-300"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:star"
                  @click="rateTalent(job.id)"
                  class="group-hover:border-yellow-200 group-hover:bg-yellow-50 group-hover:text-yellow-700 dark:group-hover:border-yellow-800 dark:group-hover:bg-yellow-950 dark:group-hover:text-yellow-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanban View -->
      <div v-else-if="viewMode === 'kanban'" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Live Jobs Column -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Live Jobs</h3>
              <span
                class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                {{ clientLiveJobs.length }}
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="job in clientLiveJobs"
                :key="job.id"
                class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-green-500/20 hover:shadow-md"
              >
                <h4 class="text-foreground mb-2 line-clamp-2 font-medium">
                  {{ job.title || 'Untitled Job' }}
                </h4>
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{ formatBudget(job.budget) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Applications:</span>
                    <span class="text-foreground">{{ job.totalApplications || 0 }}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon="mdi:eye"
                  @click="viewLiveJob(job.id)"
                  class="w-full"
                >
                  View & Approve
                </Button>
              </div>
            </div>
          </div>

          <!-- Draft Jobs Column -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Draft Jobs</h3>
              <span
                class="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              >
                {{ clientDrafts.length }}
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="draft in clientDrafts"
                :key="draft.id"
                class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-orange-500/20 hover:shadow-md"
              >
                <h4 class="text-foreground mb-2 line-clamp-2 font-medium">
                  {{ draft.title || 'Untitled Job' }}
                </h4>
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{
                      formatBudget(draft.budget)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Version:</span>
                    <span class="text-foreground">v{{ draft.version || 1 }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="mdi:pencil"
                    @click="editDraft(draft.id)"
                    class="flex-1"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="mdi:trash-can"
                    @click="confirmDiscardDraft(draft)"
                    class="text-destructive hover:text-destructive hover:bg-destructive/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Jobs Column -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-foreground text-lg font-semibold">Completed Jobs</h3>
              <span
                class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ clientCompletedJobs.length }}
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="job in clientCompletedJobs"
                :key="job.id"
                class="bg-card border-border group rounded-lg border p-4 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md"
              >
                <h4 class="text-foreground mb-2 line-clamp-2 font-medium">
                  {{ job.title || 'Untitled Job' }}
                </h4>
                <div class="mb-3 space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Budget:</span>
                    <span class="text-foreground font-medium">{{ formatBudget(job.budget) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Completed:</span>
                    <span class="text-foreground">{{
                      formatDate(job.closedDate || job.updatedAt)
                    }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="mdi:download"
                    @click="downloadDelivery(job.id)"
                    class="flex-1"
                  >
                    Download
                  </Button>
                  <Button variant="outline" size="sm" icon="mdi:star" @click="rateTalent(job.id)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          clientDrafts.length === 0 &&
          clientLiveJobs.length === 0 &&
          clientCompletedJobs.length === 0
        "
        class="py-12 text-center"
      >
        <BriefcaseIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 class="text-foreground mb-2 text-lg font-medium">No Jobs Yet</h3>
        <p class="text-muted-foreground mb-6">
          Start creating your first job posting or save a draft to continue later
        </p>
        <Button variant="primary" icon="mdi:plus" @click="openJobCreationModal"
          >Create Your First Job</Button
        >
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

    <!-- Job Rating Modal -->
    <JobRatingModal
      :open="showRatingModal"
      :job-title="selectedJobForRating?.title || ''"
      :talent-id="selectedJobForRating?.selectedTalents?.[0] || ''"
      :talent-name="getTalentName(selectedJobForRating?.selectedTalents?.[0] || '')"
      :voice-type="selectedJobForRating?.voiceType || 'talent_only'"
      :budget="selectedJobForRating?.budget || { max: 0, currency: 'USD' }"
      :completed-date="selectedJobForRating?.closedDate || selectedJobForRating?.updatedAt || ''"
      @close="
        () => {
          showRatingModal = false
          selectedJobForRating = null
        }
      "
      @submit="submitRating"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutSlots } from '@/composables/useLayoutSlots'
import Button from '@/components/atoms/Button.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import JobCreationModal from '@/components/organisms/JobCreationModal.vue'
import JobRatingModal from '@/components/molecules/JobRatingModal.vue'
import { useJob, type Job } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import type { JobPosting } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import BriefcaseIcon from '~icons/mdi/briefcase'
// Icons removed; using Button icon prop for buttons
import ChevronDownIcon from '~icons/mdi/chevron-down'
import ChevronRightIcon from '~icons/mdi/chevron-right'
// Star icon used as button icon via prop

const { setActions } = useLayoutSlots()

const router = useRouter()
const {
  deleteDraft,
  getDraftsByClient,
  getPublishedJobsByClient,
  getCompletedJobsByClient,
  refreshJobs,
} = useJob()
const { addToast: showToast } = useToast()

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// View mode state
const viewMode = ref<'list' | 'kanban'>('list')
const collapsedGroups = ref<Set<string>>(new Set())

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
const draftToDiscard = ref<Job | null>(null)

// Rating modal state
const showRatingModal = ref(false)
const selectedJobForRating = ref<Job | null>(null)

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
const confirmDiscardDraft = (draft: Job) => {
  draftToDiscard.value = draft
  showDiscardModal.value = true
}

// Discard draft
const discardDraft = () => {
  if (draftToDiscard.value) {
    const success = deleteDraft(draftToDiscard.value.id || '')
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

const handleJobCreated = (job: JobPosting) => {
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
const viewLiveJob = (jobId: string) => {
  // Navigate to talent selection view
  router.push(`/client/jobs/${jobId}/talent-selection`)
}

// Toggle group collapse
const toggleGroup = (groupName: string) => {
  if (collapsedGroups.value.has(groupName)) {
    collapsedGroups.value.delete(groupName)
  } else {
    collapsedGroups.value.add(groupName)
  }
}

// Rate talent for completed job
const rateTalent = (jobId: string) => {
  const job = clientCompletedJobs.value.find((j) => j.id === jobId)
  if (job) {
    selectedJobForRating.value = job
    showRatingModal.value = true
  }
}

// Submit rating
const submitRating = (ratingData: Record<string, unknown>) => {
  // In a real app, this would save the rating to the backend
  showToast({
    type: 'success',
    title: 'Rating Submitted',
    message: `Thank you for rating ${ratingData.talentName}! Your feedback helps improve our platform.`,
  })

  // Close modal
  showRatingModal.value = false
  selectedJobForRating.value = null
}

// Helper function to get talent name
const getTalentName = (talentId: string) => {
  if (!talentId) return 'Unknown Talent'
  // Import mock data dynamically to avoid circular dependencies
  const mockVoiceTalents = [
    { id: 'va-001', displayName: 'Sarah Johnson' },
    { id: 'va-002', displayName: 'Marcus Chen' },
    { id: 'va-003', displayName: 'Emma Rodriguez' },
    { id: 'va-004', displayName: 'Alex Thompson' },
    { id: 'va-005', displayName: 'Jessica Park' },
  ]
  const talent = mockVoiceTalents.find((va: Record<string, unknown>) => va.id === talentId)
  return talent?.displayName || 'Unknown Talent'
}

// Download delivery for completed jobs
const downloadDelivery = (jobId: string) => {
  const job = clientCompletedJobs.value.find((j) => j.id === jobId)
  if (job) {
    // In a real app, this would trigger actual file downloads
    showToast({
      type: 'info',
      title: 'Download Started',
      message: `Downloading deliverables for "${job.title}"`,
    })
  } else {
    showToast({
      type: 'warning',
      title: 'No Deliverables',
      message: 'No deliverables found for this job.',
    })
  }
}

// Formatting functions

const formatBudget = (budget: { max: number; currency: string }) => {
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

onMounted(() => {
  // Set actions (title comes from route meta)
  setActions(
    h(
      Button,
      {
        variant: 'primary',
        size: 'sm',
        icon: 'mdi:plus',
        onClick: openJobCreationModal,
      },
      () => 'Create Job',
    ),
  )
})
</script>
