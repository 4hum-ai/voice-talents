<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <VoiceActNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Casting Opportunities</template>
        <template #subtitle>Discover and apply to voice acting projects</template>
        <template #actions>
          <ThemeToggle />
          <ViewToggle v-model="viewMode" />
          <Button variant="primary" size="sm" icon="mdi:refresh" @click="refreshCasting"
            >Refresh</Button
          >
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Filters and Search -->
          <div class="mb-8">
            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="flex-1">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search casting calls by title, client, or description..."
                  @update:model-value="handleSearch"
                />
              </div>
              <div class="flex gap-2">
                <SelectInput
                  v-model="selectedType"
                  :options="typeOptions"
                  placeholder="All Types"
                  class="w-40"
                />
                <SelectInput
                  v-model="selectedLanguage"
                  :options="languageOptions"
                  placeholder="All Languages"
                  class="w-40"
                />
                <SelectInput
                  v-model="selectedExperience"
                  :options="experienceOptions"
                  placeholder="All Experience"
                  class="w-40"
                />
              </div>
            </div>
          </div>

          <!-- Stats Overview -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <MetricCard
              title="Open Casting Calls"
              :value="openCastingCount"
              icon="mdi:megaphone"
              color="blue"
            />
            <MetricCard
              title="My Submissions"
              :value="mySubmissionsCount"
              icon="mdi:clipboard-check"
              color="green"
            />
            <MetricCard
              title="Shortlisted"
              :value="shortlistedCount"
              icon="mdi:star"
              color="yellow"
            />
            <MetricCard title="Selected" :value="selectedCount" icon="mdi:trophy" color="purple" />
          </div>

          <!-- Casting Calls Grid/List -->
          <div v-if="filteredCastingSessions.length === 0" class="py-12 text-center">
            <MegaphoneIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 class="text-foreground mb-2 text-lg font-medium">No casting calls found</h3>
            <p class="text-muted-foreground mb-6">
              {{
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Check back later for new opportunities'
              }}
            </p>
            <Button variant="primary" icon="mdi:refresh" @click="refreshCasting">Refresh</Button>
          </div>

          <!-- Grid View -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="job in filteredCastingSessions"
              :key="job.id"
              class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <!-- Casting Header -->
              <div class="border-b border-gray-200 p-6 dark:border-gray-700">
                <div class="mb-3 flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-foreground mb-1 text-lg font-semibold">
                      {{ job.title }}
                    </h3>
                    <p class="text-muted-foreground text-sm">
                      {{ job.clientName }}
                    </p>
                  </div>
                  <div class="ml-4 flex-shrink-0 space-y-2">
                    <StatusBadge :status="getJobStatus(job)" />
                    <StatusBadge
                      :status="getProposalStatusInfo(job).status"
                      :variant="getProposalStatusInfo(job).variant"
                      size="sm"
                    >
                      {{ getProposalStatusInfo(job).label }}
                    </StatusBadge>
                  </div>
                </div>

                <p class="text-muted-foreground line-clamp-2 text-sm">
                  {{ job.description }}
                </p>
              </div>

              <!-- Casting Details -->
              <div class="p-6">
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Type</span>
                    <Chip size="sm" variant="secondary">
                      {{ formatProjectType(job.projectType) }}
                    </Chip>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Budget</span>
                    <span class="text-foreground font-medium">
                      ${{ job.budget?.max.toLocaleString() }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Deadline</span>
                    <span class="text-foreground font-medium">
                      {{ formatDate(job.deadline) }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Submissions</span>
                    <span class="text-foreground font-medium">
                      {{ job.totalApplications || 0 }}
                    </span>
                  </div>
                </div>

                <!-- Requirements -->
                <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div class="text-muted-foreground mb-2 text-xs">Requirements</div>
                  <div class="flex flex-wrap gap-1">
                    <Chip size="sm" variant="outline">
                      {{ job.requirements.language }}
                    </Chip>
                    <Chip size="sm" variant="outline">
                      {{ job.requirements.voiceType }}
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
                      icon="mdi:eye"
                      @click="$router.push(`/talent/jobs/${job.id}/casting`)"
                    />
                    <Button variant="ghost" size="sm" icon="mdi:share" @click="shareCasting(job)" />
                  </div>
                  <Button
                    v-if="!getUserProposalStatus(job)"
                    variant="primary"
                    size="sm"
                    icon="mdi:send"
                    @click="openSubmitModal(job.id)"
                    :disabled="job.status !== 'published' && job.status !== 'active'"
                  >
                    Apply
                  </Button>
                  <Button
                    v-else
                    variant="outline"
                    size="sm"
                    icon="mdi:eye"
                    @click="$router.push(`/talent/jobs/${job.id}/casting/proposal`)"
                    :disabled="job.status !== 'published' && job.status !== 'active'"
                  >
                    View Proposal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div
            v-else
            class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Casting Call
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Client / Studio
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Type
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Budget
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Deadline
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                >
                  <tr
                    v-for="job in filteredCastingSessions"
                    :key="job.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-foreground text-sm font-medium">
                          {{ job.title }}
                        </div>
                        <div class="text-muted-foreground line-clamp-2 text-sm">
                          {{ job.description }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-foreground text-sm">
                        {{ job.clientName }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <Chip size="sm" variant="secondary">
                        {{ formatProjectType(job.projectType) }}
                      </Chip>
                    </td>
                    <td class="text-foreground px-6 py-4 text-sm whitespace-nowrap">
                      ${{ job.budget?.max.toLocaleString() }}
                    </td>
                    <td class="text-foreground px-6 py-4 text-sm whitespace-nowrap">
                      {{ formatDate(job.deadline) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="space-y-1">
                        <StatusBadge :status="getJobStatus(job)" />
                        <StatusBadge
                          :status="getProposalStatusInfo(job).status"
                          :variant="getProposalStatusInfo(job).variant"
                          size="sm"
                        >
                          {{ getProposalStatusInfo(job).label }}
                        </StatusBadge>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="mdi:eye"
                          @click="$router.push(`/talent/jobs/${job.id}/casting`)"
                        />
                        <Button
                          v-if="!getUserProposalStatus(job)"
                          variant="primary"
                          size="sm"
                          icon="mdi:send"
                          @click="openSubmitModal(job.id)"
                          :disabled="job.status !== 'published' && job.status !== 'active'"
                        />
                        <Button
                          v-else
                          variant="outline"
                          size="sm"
                          icon="mdi:eye"
                          @click="$router.push(`/talent/jobs/${job.id}/casting/proposal`)"
                          :disabled="job.status !== 'published' && job.status !== 'active'"
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

    <!-- Casting Submit Modal -->
    <CastingSubmit
      :is-open="showSubmitModal"
      :job-id="selectedJobId"
      @close="handleCloseSubmitModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CastingSubmit from './CastingSubmit.vue'
import type { JobPosting } from '@/types/voice-client'
import { mockJobPostings } from '@/data/mock-voice-client-data'
import Button from '@/components/atoms/Button.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Chip from '@/components/atoms/Chip.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ViewToggle from '@/components/molecules/ViewToggle.vue'
import MegaphoneIcon from '~icons/mdi/megaphone'

// State
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedType = ref('')
const selectedLanguage = ref('')
const selectedExperience = ref('')
const showSubmitModal = ref(false)
const selectedJobId = ref('')

// Mock data - in real app, this would come from API
const castingSessions = ref<JobPosting[]>(
  mockJobPostings.filter((job) => job.status === 'published' || job.status === 'active'),
)

// Current user ID - in real app, this would come from auth store
const currentUserId = 'va-001'

// Computed
const filteredCastingSessions = computed(() => {
  let filtered = castingSessions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.clientName.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query),
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter((job) => job.projectType === selectedType.value)
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter((job) => job.requirements.language === selectedLanguage.value)
  }

  if (selectedExperience.value) {
    // Note: JobPosting requirements don't have experience field
    // This filter would need to be implemented differently in real app
    // filtered = filtered.filter((job) => job.requirements.experience === selectedExperience.value)
  }

  return filtered
})

const openCastingCount = computed(
  () =>
    castingSessions.value.filter((job) => job.status === 'published' || job.status === 'active')
      .length,
)

const mySubmissionsCount = computed(() => {
  return castingSessions.value.reduce((count, job) => {
    const proposal = getUserProposalStatus(job)
    return count + (proposal ? 1 : 0)
  }, 0)
})

const shortlistedCount = computed(() => {
  return castingSessions.value.reduce((count, job) => {
    const proposal = getUserProposalStatus(job)
    return count + (proposal && proposal.status === 'shortlisted' ? 1 : 0)
  }, 0)
})

const selectedCount = computed(() => {
  return castingSessions.value.reduce((count, job) => {
    const proposal = getUserProposalStatus(job)
    return count + (proposal && proposal.status === 'selected' ? 1 : 0)
  }, 0)
})

// Get user's proposal status for a casting session
const getUserProposalStatus = (job: JobPosting) => {
  // In real app, this would check if user has applied to this job
  return job.applications?.find((app) => app.voiceTalentId === currentUserId) || null
}

// Get job status for StatusBadge
const getJobStatus = (job: JobPosting) => {
  switch (job.status) {
    case 'published':
    case 'active':
      return 'active'
    case 'paused':
      return 'inactive'
    case 'closed':
      return 'inactive'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'rejected'
    default:
      return 'draft'
  }
}

// Get proposal status badge info
const getProposalStatusInfo = (job: JobPosting) => {
  const proposal = getUserProposalStatus(job)
  if (!proposal) {
    return {
      status: 'draft' as const,
      label: 'Not Applied',
      variant: 'soft' as const,
    }
  }

  switch (proposal.status) {
    case 'submitted':
      return {
        status: 'pending' as const,
        label: 'Applied',
        variant: 'soft' as const,
      }
    case 'under_review':
      return {
        status: 'processing' as const,
        label: 'Under Review',
        variant: 'soft' as const,
      }
    case 'shortlisted':
      return {
        status: 'success' as const,
        label: 'Shortlisted',
        variant: 'soft' as const,
      }
    case 'selected':
      return {
        status: 'success' as const,
        label: 'Selected',
        variant: 'solid' as const,
      }
    case 'rejected':
      return {
        status: 'rejected' as const,
        label: 'Not Selected',
        variant: 'soft' as const,
      }
    default:
      return {
        status: 'draft' as const,
        label: 'Draft',
        variant: 'soft' as const,
      }
  }
}

// Options for filters
const typeOptions = computed(() => [
  { value: '', label: 'All Types' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' },
])

const languageOptions = computed(() => [
  { value: '', label: 'All Languages' },
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' },
])

const experienceOptions = computed(() => [
  { value: '', label: 'All Experience' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' },
])

// Methods

const handleSearch = () => {
  // Search is handled by computed property
}

const refreshCasting = () => {
  // In real app, this would fetch fresh data from API
  console.log('Refreshing casting calls...')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatProjectType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}
const shareCasting = (job: JobPosting) => {
  const url = `${window.location.origin}/talent/jobs/${job.id}/casting`
  if (navigator.share) {
    navigator.share({
      title: job.title,
      text: job.description,
      url: url,
    })
  } else {
    navigator.clipboard.writeText(url)
  }
}

// Modal handlers
const openSubmitModal = (jobId: string) => {
  selectedJobId.value = jobId
  showSubmitModal.value = true
}

const handleCloseSubmitModal = () => {
  showSubmitModal.value = false
  // Optionally refresh the list to show updated proposal status
  refreshCasting()
}

onMounted(() => {
  // In real app, fetch casting sessions from API
  console.log('Casting view loaded with mock data')
})
</script>
