<template>
  <div class="bg-background min-h-screen">
    <!-- Header -->
    <AppBar :show-back="true" @back="$router.back()">
      <template #title>Talent Selection</template>
      <template #subtitle>Review applications and select talent for "{{ jobTitle }}"</template>
      <template #actions>
        <div class="flex items-center space-x-2">
          <div class="text-muted-foreground text-sm">
            {{ applications.length }} application{{ applications.length !== 1 ? 's' : '' }}
          </div>
          <Button variant="outline" size="sm" @click="$router.back()">
            <CloseIcon class="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </template>
    </AppBar>

    <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Job Overview -->
        <div class="mb-8 rounded-lg border border-border bg-card p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h1 class="text-foreground mb-2 text-2xl font-bold">{{ jobTitle }}</h1>
              <p class="text-muted-foreground mb-4">{{ jobDescription }}</p>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <span class="text-muted-foreground text-sm">Budget:</span>
                  <p class="text-foreground font-medium">{{ formatBudget(jobBudget) }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground text-sm">Deadline:</span>
                  <p class="text-foreground font-medium">{{ formatDeadline(jobDeadline) }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground text-sm">Applications:</span>
                  <p class="text-foreground font-medium">{{ applications.length }} received</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications List -->
        <div v-if="applications.length === 0" class="py-12 text-center">
          <UsersIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 class="text-foreground mb-2 text-lg font-medium">No Applications Yet</h3>
          <p class="text-muted-foreground">
            No voice actors have applied to this job yet. Check back later or consider extending the deadline.
          </p>
        </div>

        <div v-else class="space-y-6">
          <!-- Sorting and Filtering -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-muted-foreground text-sm">Sort by:</label>
                <select
                  v-model="sortBy"
                  class="border-border bg-background rounded-md border px-3 py-1 text-sm"
                >
                  <option value="date">Application Date</option>
                  <option value="rate">Proposed Rate</option>
                  <option value="rating">Talent Rating</option>
                  <option value="timeline">Timeline</option>
                </select>
              </div>
              <div class="flex items-center space-x-2">
                <label class="text-muted-foreground text-sm">Order:</label>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                >
                  <ArrowUpIcon v-if="sortOrder === 'asc'" class="h-4 w-4" />
                  <ArrowDownIcon v-else class="h-4 w-4" />
                  {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
                </Button>
              </div>
            </div>
            <div class="text-muted-foreground text-sm">
              Showing {{ sortedApplications.length }} of {{ applications.length }} applications
            </div>
          </div>

          <!-- Application Cards -->
          <div class="grid gap-6 lg:grid-cols-2">
            <div
              v-for="application in sortedApplications"
              :key="application.id"
              class="border-border bg-card hover:border-primary/20 group rounded-lg border p-6 transition-all duration-200 hover:shadow-lg"
            >
              <!-- Application Header -->
              <div class="mb-4 flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <Avatar class="h-12 w-12">
                    <AvatarImage :src="getTalentAvatar(application.voiceActorId)" />
                    <AvatarFallback>{{ application.voiceActorName.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 class="text-foreground text-lg font-semibold">{{ application.voiceActorName }}</h3>
                    <p class="text-muted-foreground text-sm">{{ getTalentLocation(application.voiceActorId) }}</p>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="flex items-center space-x-1">
                        <StarIcon class="h-4 w-4 text-yellow-500" />
                        <span class="text-foreground text-sm font-medium">{{ getTalentRating(application.voiceActorId) }}</span>
                      </div>
                      <span class="text-muted-foreground text-sm">•</span>
                      <span class="text-muted-foreground text-sm">{{ getTalentExperience(application.voiceActorId) }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-foreground text-lg font-bold">{{ formatBudget({ max: application.proposedRate, currency: application.proposedCurrency }) }}</div>
                  <div class="text-muted-foreground text-sm">{{ application.proposedTimeline }}</div>
                </div>
              </div>

              <!-- Application Details -->
              <div class="mb-4 space-y-3">
                <div>
                  <h4 class="text-foreground mb-2 font-medium">Cover Letter</h4>
                  <p class="text-muted-foreground text-sm line-clamp-3">{{ application.coverLetter }}</p>
                </div>
                <div>
                  <h4 class="text-foreground mb-2 font-medium">Relevant Experience</h4>
                  <p class="text-muted-foreground text-sm line-clamp-2">{{ application.relevantExperience }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  @click="viewApplication(application.id)"
                  class="flex-1"
                >
                  <EyeIcon class="mr-2 h-4 w-4" />
                  View Full Application
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  :disabled="isTalentSelected(application.voiceActorId)"
                  @click="selectTalent(application)"
                  class="flex-1"
                >
                  <CheckIcon class="mr-2 h-4 w-4" />
                  {{ isTalentSelected(application.voiceActorId) ? 'Selected' : 'Select Talent' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Detail Modal (lightweight, no external dialog dependency) -->
    <div
      v-if="showApplicationDetail"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showApplicationDetail = false"
    >
      <div class="bg-background border-border w-full max-w-3xl rounded-lg border shadow-lg">
        <div class="border-border flex items-center justify-between border-b p-4">
          <div>
            <h3 class="text-foreground text-lg font-semibold">Application Details</h3>
            <p class="text-muted-foreground text-sm">
              Full application from {{ selectedApplication?.voiceActorName }}
            </p>
          </div>
          <Button variant="ghost" size="sm" @click="showApplicationDetail = false">
            <CloseIcon class="h-5 w-5" />
          </Button>
        </div>

        <div v-if="selectedApplication" class="space-y-6 p-6">
          <!-- Talent Info -->
          <div class="flex items-center space-x-4">
            <Avatar class="h-16 w-16">
              <AvatarImage :src="getTalentAvatar(selectedApplication.voiceActorId)" />
              <AvatarFallback>{{ selectedApplication.voiceActorName.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div>
              <h3 class="text-foreground text-xl font-semibold">{{ selectedApplication.voiceActorName }}</h3>
              <p class="text-muted-foreground">{{ getTalentLocation(selectedApplication.voiceActorId) }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <div class="flex items-center space-x-1">
                  <StarIcon class="h-4 w-4 text-yellow-500" />
                  <span class="text-foreground font-medium">{{ getTalentRating(selectedApplication.voiceActorId) }}</span>
                </div>
                <span class="text-muted-foreground">•</span>
                <span class="text-muted-foreground">{{ getTalentExperience(selectedApplication.voiceActorId) }}</span>
              </div>
            </div>
          </div>

          <!-- Proposal Details -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 class="text-foreground mb-2 font-medium">Proposed Rate</h4>
              <p class="text-foreground text-lg font-semibold">{{ formatBudget({ max: selectedApplication.proposedRate, currency: selectedApplication.proposedCurrency }) }}</p>
            </div>
            <div>
              <h4 class="text-foreground mb-2 font-medium">Timeline</h4>
              <p class="text-foreground">{{ selectedApplication.proposedTimeline }}</p>
            </div>
          </div>

          <!-- Cover Letter -->
          <div>
            <h4 class="text-foreground mb-2 font-medium">Cover Letter</h4>
            <p class="text-muted-foreground whitespace-pre-wrap">{{ selectedApplication.coverLetter }}</p>
          </div>

          <!-- Experience -->
          <div>
            <h4 class="text-foreground mb-2 font-medium">Relevant Experience</h4>
            <p class="text-muted-foreground whitespace-pre-wrap">{{ selectedApplication.relevantExperience }}</p>
          </div>
          <div class="border-border flex items-center justify-end space-x-2 border-t p-4">
            <Button variant="outline" @click="showApplicationDetail = false">Close</Button>
            <Button
              v-if="selectedApplication"
              variant="primary"
              :disabled="isTalentSelected(selectedApplication.voiceActorId)"
              @click="selectTalent(selectedApplication as any)"
            >
              <CheckIcon class="mr-2 h-4 w-4" />
              Select This Talent
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
// Using lightweight in-view modal; no external dialog imports
import { useJob } from '@/composables/useJob'
import { useToast } from '@/composables/useToast'
import { mockVoiceActors } from '@/data/mock-voice-actor-data'
import CloseIcon from '~icons/mdi/close'
import UsersIcon from '~icons/mdi/account-group'
import StarIcon from '~icons/mdi/star'
import EyeIcon from '~icons/mdi/eye'
import CheckIcon from '~icons/mdi/check'
import ArrowUpIcon from '~icons/mdi/arrow-up'
import ArrowDownIcon from '~icons/mdi/arrow-down'
import type { JobApplication } from '@/types/voice-client'

const route = useRoute()
const router = useRouter()
const { getJob } = useJob()
const { addToast: showToast } = useToast()

// State
const job = ref<any>(null)
const applications = ref<JobApplication[]>([])
const selectedApplication = ref<JobApplication | null>(null)
const showApplicationDetail = ref(false)
const sortBy = ref<'date' | 'rate' | 'rating' | 'timeline'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed
const jobTitle = computed(() => job.value?.title || 'Untitled Job')
const jobDescription = computed(() => job.value?.description || '')
const jobBudget = computed(() => job.value?.budget)
const jobDeadline = computed(() => job.value?.deadline)

const sortedApplications = computed(() => {
  const sorted = [...applications.value].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy.value) {
      case 'rate':
        aValue = a.proposedRate
        bValue = b.proposedRate
        break
      case 'rating':
        aValue = getTalentRating(a.voiceActorId)
        bValue = getTalentRating(b.voiceActorId)
        break
      case 'timeline':
        // Simple timeline comparison (could be improved)
        aValue = a.proposedTimeline
        bValue = b.proposedTimeline
        break
      case 'date':
      default:
        aValue = new Date(a.appliedDate).getTime()
        bValue = new Date(b.appliedDate).getTime()
        break
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return sorted
})

// Methods
const getTalentAvatar = (talentId: string) => {
  const talent = mockVoiceActors.find(va => va.id === talentId)
  return talent?.avatarUrl || ''
}

const getTalentLocation = (talentId: string) => {
  const talent = mockVoiceActors.find(va => va.id === talentId)
  return talent?.location || 'Location not specified'
}

const getTalentRating = (talentId: string) => {
  const talent = mockVoiceActors.find(va => va.id === talentId)
  return talent?.averageRating || 0
}

const getTalentExperience = (talentId: string) => {
  const talent = mockVoiceActors.find(va => va.id === talentId)
  return talent?.experience || 'Unknown'
}

const formatBudget = (budget: { max: number; currency: string }) => {
  if (!budget || !budget.max) return 'Not set'
  const symbol = getCurrencySymbol(budget.currency)
  return `${symbol}${budget.max.toLocaleString()}`
}

const formatDeadline = (deadline: string) => {
  if (!deadline) return 'Not set'
  const date = new Date(deadline)
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

const isTalentSelected = (talentId: string) => {
  return job.value?.selectedTalents?.includes(talentId) || false
}

const selectTalent = (application: JobApplication) => {
  if (job.value) {
    // In a real app, this would update the job status and notify the talent
    showToast({
      type: 'success',
      title: 'Talent Selected',
      message: `Contract awarded to ${application.voiceActorName} for "${job.value.title}"`,
    })
    
    // Navigate back to job management
    router.push('/client/jobs')
  }
}

const viewApplication = (applicationId: string) => {
  selectedApplication.value = applications.value.find(app => app.id === applicationId) || null
  showApplicationDetail.value = true
}

// Load job data
const loadJob = (id: string | undefined) => {
  if (!id) return
  const found = getJob(id)
  if (found) {
    job.value = found
    applications.value = found.applications || []
  } else {
    showToast({
      type: 'error',
      title: 'Job Not Found',
      message: 'The requested job could not be found.',
    })
    router.push('/client/jobs')
  }
}

onMounted(() => {
  loadJob(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => loadJob(newId as string),
)
</script>
