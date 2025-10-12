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
          <!-- Premium Banner -->
          <div class="mb-8">
            <PremiumBanner @upgrade="openJobCreationModal" />
          </div>
          
          <!-- Published Jobs Section -->
          <div v-if="clientPublishedJobs.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-foreground">Published Jobs</h2>
              <span class="text-sm text-muted-foreground">{{ clientPublishedJobs.length }} job{{ clientPublishedJobs.length !== 1 ? 's' : '' }}</span>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div 
                v-for="job in clientPublishedJobs" 
                :key="job.id"
                class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200 group"
              >
                <!-- Header with status indicator -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 class="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {{ job.title || 'Untitled Job' }}
                      </h3>
                      <div class="flex items-center space-x-1">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Published"></div>
                        <span class="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</span>
                      </div>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {{ job.description || 'No description provided' }}
                    </p>
                  </div>
                </div>
                
                <!-- Job details grid -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:briefcase" class="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Type</p>
                      <p class="text-sm font-medium text-foreground">{{ formatJobType(job.jobType) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:currency-usd" class="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Budget</p>
                      <p class="text-sm font-medium text-foreground">{{ formatBudget(job.budget) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:clock-outline" class="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Deadline</p>
                      <p class="text-sm font-medium text-foreground">{{ formatDeadline(job.deadline) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:account-group" class="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Applications</p>
                      <p class="text-sm font-medium text-foreground">{{ job.totalApplications || 0 }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                      <Icon :name="(job as any).paymentDetails?.method === 'direct' ? 'mdi:handshake' : 'mdi:shield-check'" 
                            :class="(job as any).paymentDetails?.method === 'direct' ? 'text-green-500' : 'text-blue-500'" 
                            class="h-4 w-4" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Payment</p>
                      <p class="text-sm font-medium text-foreground">
                        {{ (job as any).paymentDetails?.method === 'direct' ? 'Direct' : 'Online' }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Requirements summary -->
                <div v-if="job.requirements" class="mb-4 p-3 bg-muted/30 rounded-lg">
                  <div class="flex items-center space-x-2 mb-2">
                    <Icon name="mdi:microphone" class="h-4 w-4 text-muted-foreground" />
                    <span class="text-xs font-medium text-muted-foreground">Requirements</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="job.requirements.voiceTypes?.length" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {{ job.requirements.voiceTypes[0] }}
                    </span>
                    <span v-if="job.requirements.languages?.length" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {{ job.requirements.languages[0] }}
                    </span>
                    <span v-if="job.requirements.gender && job.requirements.gender !== 'any'" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                      {{ job.requirements.gender }}
                    </span>
                  </div>
                </div>
                
                <!-- Footer with actions and timestamp -->
                <div class="flex items-center justify-between pt-4 border-t border-border">
                  <div class="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="mdi:eye" class="h-3 w-3" />
                    <span>{{ job.viewCount || 0 }} views</span>
                    <span>•</span>
                    <span>Published {{ formatDate(job.publishedDate || job.createdDate) }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      @click="viewJob(job.id)"
                      class="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Icon name="mdi:eye" class="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      @click="editJob(job.id)"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <EditIcon class="h-3 w-3" />
                    </Button>
                  </div>
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
            
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div 
                v-for="draft in clientDrafts" 
                :key="draft.id"
                class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-orange-500/20 transition-all duration-200 group"
              >
                <!-- Header with draft status -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 class="font-semibold text-foreground text-lg group-hover:text-orange-500 transition-colors">
                        {{ draft.title || 'Untitled Job' }}
                      </h3>
                      <div class="flex items-center space-x-1">
                        <div class="w-2 h-2 bg-orange-500 rounded-full" title="Draft"></div>
                        <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">DRAFT</span>
                      </div>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {{ draft.description || 'No description provided' }}
                    </p>
                  </div>
                </div>
                
                <!-- Job details grid -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:briefcase" class="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Type</p>
                      <p class="text-sm font-medium text-foreground">{{ formatJobType(draft.jobType) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:currency-usd" class="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Budget</p>
                      <p class="text-sm font-medium text-foreground">{{ formatBudget(draft.budget) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:clock-outline" class="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Deadline</p>
                      <p class="text-sm font-medium text-foreground">{{ formatDeadline(draft.deadline) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="mdi:file-document-edit" class="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Version</p>
                      <p class="text-sm font-medium text-foreground">v{{ draft.version || 1 }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                      <Icon :name="(draft as any).paymentDetails?.method === 'direct' ? 'mdi:handshake' : 'mdi:shield-check'" 
                            :class="(draft as any).paymentDetails?.method === 'direct' ? 'text-green-500' : 'text-blue-500'" 
                            class="h-4 w-4" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Payment</p>
                      <p class="text-sm font-medium text-foreground">
                        {{ (draft as any).paymentDetails?.method === 'direct' ? 'Direct' : 'Online' }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Requirements summary -->
                <div v-if="draft.requirements" class="mb-4 p-3 bg-muted/30 rounded-lg">
                  <div class="flex items-center space-x-2 mb-2">
                    <Icon name="mdi:microphone" class="h-4 w-4 text-muted-foreground" />
                    <span class="text-xs font-medium text-muted-foreground">Requirements</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="draft.requirements.voiceTypes?.length" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {{ draft.requirements.voiceTypes[0] }}
                    </span>
                    <span v-if="draft.requirements.languages?.length" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {{ draft.requirements.languages[0] }}
                    </span>
                    <span v-if="draft.requirements.gender && draft.requirements.gender !== 'any'" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                      {{ draft.requirements.gender }}
                    </span>
                  </div>
                </div>
                
                <!-- Footer with actions and timestamp -->
                <div class="flex items-center justify-between pt-4 border-t border-border">
                  <div class="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="mdi:content-save" class="h-3 w-3" />
                    <span v-if="draft.autoSaved" class="text-orange-600 dark:text-orange-400">Auto-saved</span>
                    <span v-else>Saved</span>
                    <span>•</span>
                    <span>{{ formatDate(draft.lastSaved) }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      @click="editDraft(draft.id)"
                      class="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <EditIcon class="h-3 w-3 mr-1" />
                      Continue Editing
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      @click="confirmDiscardDraft(draft)"
                      class="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <TrashIcon class="h-3 w-3" />
                    </Button>
                  </div>
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
import Icon from '@/components/atoms/Icon.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import PremiumBanner from '@/components/molecules/PremiumBanner.vue'
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
  
  // Refresh the jobs list to show the updated status
  refreshJobs()
}

const viewJob = (_jobId: string) => {
  // In a real app, this would navigate to a job detail view
  showToast({
    type: 'info',
    title: 'Job Details',
    message: 'Job detail view would open here'
  })
}

const editJob = (jobId: string) => {
  // Convert published job back to draft for editing
  selectedDraftId.value = jobId
  showJobCreationModal.value = true
}

// Formatting functions
const formatJobType = (jobType: string) => {
  return jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
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
    VND: '₫'
  }
  return symbols[currency] || '$'
}
</script>
