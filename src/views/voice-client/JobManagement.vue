<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-card border-border border-b shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-foreground text-2xl font-bold">Job Management</h1>
                <p class="text-muted-foreground text-sm">Manage your voice acting job postings</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="primary" size="sm" @click="openJobCreationModal">
                <PlusIcon class="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-8 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Published Jobs Section -->
          <div v-if="clientPublishedJobs.length > 0" class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-foreground text-lg font-semibold">Published Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientPublishedJobs.length }} job{{
                  clientPublishedJobs.length !== 1 ? 's' : ''
                }}</span
              >
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="job in clientPublishedJobs"
                :key="job.id"
                class="bg-card border-border hover:border-primary/20 group rounded-lg border p-6 transition-all duration-200 hover:shadow-lg"
              >
                <!-- Header with status indicator -->
                <div class="mb-4 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center space-x-2">
                      <h3
                        class="text-foreground group-hover:text-primary text-lg font-semibold transition-colors"
                      >
                        {{ job.title || 'Untitled Job' }}
                      </h3>
                      <div class="flex items-center space-x-1">
                        <div
                          class="h-2 w-2 animate-pulse rounded-full bg-green-500"
                          title="Published"
                        ></div>
                        <span class="text-xs font-medium text-green-600 dark:text-green-400"
                          >LIVE</span
                        >
                      </div>
                    </div>
                    <p class="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {{ job.description || 'No description provided' }}
                    </p>
                  </div>
                </div>

                <!-- Job details - simplified -->
                <div class="mb-4 space-y-3">
                  <!-- Key metrics row -->
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center space-x-4">
                      <span class="text-muted-foreground">{{ formatJobType(job.jobType) }}</span>
                      <span class="text-foreground font-medium">{{
                        formatBudget(job.budget)
                      }}</span>
                    </div>
                    <div class="text-muted-foreground flex items-center space-x-4">
                      <span>{{ formatDeadline(job.deadline) }}</span>
                      <span>{{ job.totalApplications || 0 }} applications</span>
                    </div>
                  </div>
                </div>

                <!-- Requirements summary - simplified -->
                <div v-if="job.requirements" class="mb-4">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-if="job.requirements.voiceTypes?.length"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ job.requirements.voiceTypes[0] }}
                    </span>
                    <span
                      v-if="job.requirements.languages?.length"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ job.requirements.languages[0] }}
                    </span>
                    <span
                      v-if="job.requirements.gender && job.requirements.gender !== 'any'"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ job.requirements.gender }}
                    </span>
                  </div>
                </div>

                <!-- Footer with actions and timestamp - simplified -->
                <div class="border-border flex items-center justify-between border-t pt-4">
                  <div class="text-muted-foreground text-xs">
                    Published {{ formatDate(job.publishedDate || job.createdDate) }}
                  </div>

                  <div class="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="viewJob(job.id)"
                      class="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="editJob(job.id)"
                      class="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <EditIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Drafts Section -->
          <div v-if="clientDrafts.length > 0" class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-foreground text-lg font-semibold">Draft Jobs</h2>
              <span class="text-muted-foreground text-sm"
                >{{ clientDrafts.length }} draft{{ clientDrafts.length !== 1 ? 's' : '' }}</span
              >
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="draft in clientDrafts"
                :key="draft.id"
                class="bg-card border-border group rounded-lg border p-6 transition-all duration-200 hover:border-orange-500/20 hover:shadow-lg"
              >
                <!-- Header with draft status -->
                <div class="mb-4 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center space-x-2">
                      <h3
                        class="text-foreground text-lg font-semibold transition-colors group-hover:text-orange-500"
                      >
                        {{ draft.title || 'Untitled Job' }}
                      </h3>
                      <div class="flex items-center space-x-1">
                        <div class="h-2 w-2 rounded-full bg-orange-500" title="Draft"></div>
                        <span class="text-xs font-medium text-orange-600 dark:text-orange-400"
                          >DRAFT</span
                        >
                      </div>
                    </div>
                    <p class="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {{ draft.description || 'No description provided' }}
                    </p>
                  </div>
                </div>

                <!-- Job details - simplified -->
                <div class="mb-4 space-y-3">
                  <!-- Key metrics row -->
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center space-x-4">
                      <span class="text-muted-foreground">{{ formatJobType(draft.jobType) }}</span>
                      <span class="text-foreground font-medium">{{
                        formatBudget(draft.budget)
                      }}</span>
                    </div>
                    <div class="text-muted-foreground flex items-center space-x-4">
                      <span>{{ formatDeadline(draft.deadline) }}</span>
                      <span>v{{ draft.version || 1 }}</span>
                    </div>
                  </div>
                </div>

                <!-- Requirements summary - simplified -->
                <div v-if="draft.requirements" class="mb-4">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-if="draft.requirements.voiceTypes?.length"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ draft.requirements.voiceTypes[0] }}
                    </span>
                    <span
                      v-if="draft.requirements.languages?.length"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ draft.requirements.languages[0] }}
                    </span>
                    <span
                      v-if="draft.requirements.gender && draft.requirements.gender !== 'any'"
                      class="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-1 text-xs"
                    >
                      {{ draft.requirements.gender }}
                    </span>
                  </div>
                </div>

                <!-- Footer with actions and timestamp - simplified -->
                <div class="border-border flex items-center justify-between border-t pt-4">
                  <div class="text-muted-foreground text-xs">
                    {{ formatDate(draft.lastSaved) }}
                  </div>

                  <div class="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="editDraft(draft.id)"
                      class="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Continue Editing
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="confirmDiscardDraft(draft)"
                      class="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="clientDrafts.length === 0 && clientPublishedJobs.length === 0"
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
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import JobCreationModal from '@/components/organisms/JobCreationModal.vue'
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { mockClientData } from '@/data/mock-voice-client-data'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import PlusIcon from '~icons/mdi/plus'
import BriefcaseIcon from '~icons/mdi/briefcase'
import EditIcon from '~icons/mdi/pencil'
import TrashIcon from '~icons/mdi/trash-can'

// const router = useRouter() // Not needed with modal approach
const { deleteDraft, getDraftsByClient, getPublishedJobsByClient, refreshJobs } = useJob()
const { addToast: showToast } = useToast()

// Get current client (in real app, this would come from auth)
const currentClient = ref(mockClientData.voiceClients[0])

// Filter jobs for current client
const clientDrafts = computed(() => {
  return getDraftsByClient(currentClient.value.id)
})

const clientPublishedJobs = computed(() => {
  return getPublishedJobsByClient(currentClient.value.id)
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

const viewJob = (_jobId: string) => {
  // In a real app, this would navigate to a job detail view
  showToast({
    type: 'info',
    title: 'Job Details',
    message: 'Job detail view would open here',
  })
}

const editJob = (jobId: string) => {
  // Convert published job back to draft for editing
  selectedDraftId.value = jobId
  showJobCreationModal.value = true
}

// Formatting functions
const formatJobType = (jobType: string) => {
  return jobType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
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
