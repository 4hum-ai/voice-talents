<template>
  <div class="min-h-screen bg-background flex">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

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
                  Job Management
                </h1>
                <p class="text-sm text-muted-foreground">
                  Manage your voice acting job postings
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="primary" size="sm" @click="openJobCreationModal">
                <PlusIcon class="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Published Jobs Section -->
          <div v-if="clientPublishedJobs.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-foreground">Published Jobs</h2>
              <span class="text-sm text-muted-foreground">{{ clientPublishedJobs.length }} job{{ clientPublishedJobs.length !== 1 ? 's' : '' }}</span>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div 
                v-for="job in clientPublishedJobs" 
                :key="job.id"
                class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-foreground mb-1">
                      {{ job.title || 'Untitled Job' }}
                    </h3>
                    <p class="text-sm text-muted-foreground line-clamp-2">
                      {{ job.description || 'No description' }}
                    </p>
                  </div>
                  <div class="flex items-center ml-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full" title="Published"></div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{{ job.jobType.replace('_', ' ').toUpperCase() }}</span>
                  <span>{{ formatDate(job.createdDate) }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="viewJob(job.id)"
                    class="flex-1"
                  >
                    <EditIcon class="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Drafts Section -->
          <div v-if="clientDrafts.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-foreground">Draft Jobs</h2>
              <span class="text-sm text-muted-foreground">{{ clientDrafts.length }} draft{{ clientDrafts.length !== 1 ? 's' : '' }}</span>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div 
                v-for="draft in clientDrafts" 
                :key="draft.id"
                class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-foreground mb-1">
                      {{ draft.title || 'Untitled Job' }}
                    </h3>
                    <p class="text-sm text-muted-foreground line-clamp-2">
                      {{ draft.description || 'No description' }}
                    </p>
                  </div>
                  <div class="flex items-center ml-2">
                    <div class="w-2 h-2 bg-orange-500 rounded-full" title="Draft"></div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{{ draft.jobType.replace('_', ' ').toUpperCase() }}</span>
                  <span>{{ formatDate(draft.lastSaved) }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="editDraft(draft.id)"
                    class="flex-1"
                  >
                    <EditIcon class="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    @click="confirmDiscardDraft(draft)"
                    class="text-destructive hover:text-destructive"
                  >
                    <TrashIcon class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="clientDrafts.length === 0 && clientPublishedJobs.length === 0" class="text-center py-12">
            <BriefcaseIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-medium text-foreground mb-2">
              No Jobs Yet
            </h3>
            <p class="text-muted-foreground mb-6">
              Start creating your first job posting or save a draft to continue later
            </p>
            <Button variant="primary" @click="openJobCreationModal">
              <PlusIcon class="h-4 w-4 mr-2" />
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
const { deleteDraft, getDraftsByClient, getPublishedJobsByClient } = useJob()
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
  } else if (diffInHours < 168) { // 7 days
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
        message: `"${draftToDiscard.value.title || 'Untitled Job'}" has been discarded.`
      })
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to discard draft. Please try again.'
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
    message: `"${job.title}" has been published successfully!`
  })
  closeJobCreationModal()
}

const viewJob = (_jobId: string) => {
  // In a real app, this would navigate to a job detail view
  showToast({
    type: 'info',
    title: 'Job Details',
    message: 'Job detail view would open here'
  })
}
</script>
