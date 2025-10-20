<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar>
        <template #title>Client Dashboard</template>
        <template #subtitle>Welcome back, {{ currentClient?.contactName }}</template>
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
          <!-- Stats Overview -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Jobs"
              :value="stats.activeJobs"
              icon="mdi:briefcase"
              color="blue"
            />
            <MetricCard
              title="Total Spent"
              :value="`$${stats.totalSpent.toLocaleString()}`"
              icon="mdi:currency-usd"
              color="green"
            />
            <MetricCard
              title="Hired Talents"
              :value="stats.hiredTalents"
              icon="mdi:account-check"
              color="purple"
            />
          </div>

          <!-- Quick Actions -->
          <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Create New -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Quick Actions</h3>
              <div class="space-y-3">
                <Button
                  variant="outline"
                  class="w-full justify-start"
                  @click="openJobCreationModal"
                >
                  <BriefcaseIcon class="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  class="w-full justify-start"
                  @click="$router.push('/client/campaigns/create')"
                >
                  <MegaphoneIcon class="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  class="w-full justify-start"
                  @click="$router.push('/client/talents')"
                >
                  <AccountGroupIcon class="mr-2 h-4 w-4" />
                  Talents
                </Button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Recent Activity</h3>
              <div class="space-y-3">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="hover:bg-muted flex cursor-pointer items-start space-x-3 rounded-lg p-3 transition-colors"
                  @click="activity.url && $router.push(activity.url)"
                >
                  <div class="flex-shrink-0">
                    <div class="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-foreground text-sm font-medium">
                      {{ activity.title }}
                    </p>
                    <p class="text-muted-foreground text-xs">
                      {{ activity.description }}
                    </p>
                    <p class="text-muted-foreground mt-1 text-xs">
                      {{ formatTimeAgo(activity.timestamp) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jobs Overview -->
          <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Active Jobs -->
            <div class="bg-card border-border rounded-lg border">
              <div class="border-border border-b p-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-lg font-semibold">Active Jobs</h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/client/jobs')">
                    View All
                  </Button>
                </div>
              </div>
              <div class="p-6">
                <div v-if="activeJobs.length === 0" class="py-8 text-center">
                  <BriefcaseIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h4 class="text-foreground mb-2 text-sm font-medium">No active jobs</h4>
                  <p class="text-muted-foreground mb-4 text-xs">
                    Create your first job posting to get started
                  </p>
                  <Button variant="primary" size="sm" @click="openJobCreationModal">
                    Create Job
                  </Button>
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="job in activeJobs"
                    :key="job.id"
                    class="border-border cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-sm"
                    @click="$router.push(`/client/jobs/${job.id}`)"
                  >
                    <div class="mb-2 flex items-start justify-between">
                      <h4 class="text-foreground text-sm font-medium">
                        {{ job.title }}
                      </h4>
                      <StatusBadge :status="getJobStatus(job.status)" />
                    </div>
                    <p class="text-muted-foreground mb-3 line-clamp-2 text-xs">
                      {{ job.description }}
                    </p>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-muted-foreground">
                        {{ job.totalApplications }} applications
                      </span>
                      <span class="text-foreground font-medium">
                        ${{ job.budget.min.toLocaleString() }} - ${{
                          job.budget.max.toLocaleString()
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Applications -->
            <div class="bg-card border-border rounded-lg border">
              <div class="border-border border-b p-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-lg font-semibold">Recent Applications</h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/client/jobs')">
                    View All
                  </Button>
                </div>
              </div>
              <div class="p-6">
                <div v-if="recentApplications.length === 0" class="py-8 text-center">
                  <EmailIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h4 class="text-foreground mb-2 text-sm font-medium">No applications yet</h4>
                  <p class="text-muted-foreground text-xs">
                    Applications will appear here once you post jobs
                  </p>
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="application in recentApplications"
                    :key="application.id"
                    class="border-border cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-sm"
                    @click="$router.push(`/client/jobs/${application.jobId}`)"
                  >
                    <div class="mb-2 flex items-start justify-between">
                      <div>
                        <h4 class="text-foreground text-sm font-medium">
                          {{ application.voiceActorName }}
                        </h4>
                        <p class="text-muted-foreground text-xs">
                          Applied to {{ getJobTitle(application.jobId) }}
                        </p>
                      </div>
                      <StatusBadge :status="getApplicationStatus(application.status)" />
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-muted-foreground">
                        {{ formatTimeAgo(application.appliedDate) }}
                      </span>
                      <span class="text-foreground font-medium">
                        ${{ application.proposedRate.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Creation Modal -->
    <JobCreationModal
      :open="showJobCreationModal"
      @close="closeJobCreationModal"
      @complete="handleJobCreated"
    />

    <!-- Client Onboarding -->
    <ClientOnboardingFlow
      :show="showClientOnboarding"
      @complete="completeClientOnboarding"
      @skip="skipClientOnboarding"
      @close="closeClientOnboarding"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {
  VoiceClient,
  ClientStats,
  JobPosting,
  JobApplication,
} from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import JobCreationModal from '@/components/organisms/JobCreationModal.vue'
import ClientOnboardingFlow from '@/components/organisms/ClientOnboardingFlow.vue'
import { useToast } from '@/composables/useToast'
import { useOnboarding } from '@/composables/useOnboarding'
import PlusIcon from '~icons/mdi/plus'
import BriefcaseIcon from '~icons/mdi/briefcase'
import MegaphoneIcon from '~icons/mdi/megaphone'
import AccountGroupIcon from '~icons/mdi/account-group'
import EmailIcon from '~icons/mdi/email'

// Mock data - in real app, this would come from API
const currentClient = ref<VoiceClient>(mockClientData.voiceClients[0])
const stats = ref<ClientStats>(mockClientData.clientStats)
const jobPostings = ref<JobPosting[]>(mockClientData.jobPostings)
const applications = ref<JobApplication[]>(mockClientData.jobApplications)

// Onboarding logic
const { shouldShowOnboarding, isTalentMode, setUserMode } = useOnboarding()
const { addToast: showToast, success } = useToast()

// Modal state
const showJobCreationModal = ref(false)

// Computed
const recentActivity = computed(() => stats.value.recentActivity.slice(0, 5))

const activeJobs = computed(() =>
  jobPostings.value.filter((job) => job.status === 'active').slice(0, 3),
)

const recentApplications = computed(() =>
  applications.value
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 3),
)


const showClientOnboarding = computed(() => !isTalentMode.value && shouldShowOnboarding.value)

// Methods

const getJobStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'active'
    case 'published':
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

const getApplicationStatus = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'pending'
    case 'under_review':
      return 'processing'
    case 'shortlisted':
      return 'success'
    case 'selected':
      return 'success'
    case 'rejected':
      return 'rejected'
    default:
      return 'draft'
  }
}

const getJobTitle = (jobId: string) => {
  const job = jobPostings.value.find((j) => j.id === jobId)
  return job?.title || 'Unknown Job'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}w ago`
}

// Modal methods
const openJobCreationModal = () => {
  showJobCreationModal.value = true
}

const closeJobCreationModal = () => {
  showJobCreationModal.value = false
}

const handleJobCreated = (job: any) => {
  showToast({
    type: 'success',
    title: 'Job Published',
    message: `"${job.title}" has been published successfully!`,
  })
  closeJobCreationModal()

  // Force refresh the dashboard data
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

// Client onboarding methods
const completeClientOnboarding = () => {
  success('Welcome to VoiceAct! Your client profile is ready to go.')
}

const skipClientOnboarding = () => {
  success('You can complete your profile later in settings.')
}

const closeClientOnboarding = () => {
  // Onboarding will be hidden automatically by the computed property
}

onMounted(() => {
  // Set user mode to client when accessing client dashboard
  setUserMode('client')

  // In real app, fetch client data from API
  console.log('Client dashboard loaded')
})
</script>
