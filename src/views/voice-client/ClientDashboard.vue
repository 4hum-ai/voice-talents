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
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  Client Dashboard
                </h1>
                <p class="text-sm text-muted-foreground">
                  Welcome back, {{ currentClient?.contactName }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="primary" size="sm" @click="$router.push('/client/jobs/create')">
                <PlusIcon class="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <MetricCard 
              title="Active Campaigns" 
              :value="stats.activeCampaigns" 
              icon="mdi:megaphone" 
              color="orange" 
            />
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Create New -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h3 class="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <Button 
                  variant="outline" 
                  class="w-full justify-start"
                  @click="$router.push('/client/jobs/create')"
                >
                  <BriefcaseIcon class="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
                <Button 
                  variant="outline" 
                  class="w-full justify-start"
                  @click="$router.push('/client/campaigns/create')"
                >
                  <MegaphoneIcon class="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button 
                  variant="outline" 
                  class="w-full justify-start"
                  @click="$router.push('/client/talents')"
                >
                  <AccountGroupIcon class="h-4 w-4 mr-2" />
                  Browse Talents
                </Button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h3 class="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div class="space-y-3">
                <div 
                  v-for="activity in recentActivity" 
                  :key="activity.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  @click="activity.url && $router.push(activity.url)"
                >
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-foreground">
                      {{ activity.title }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ formatTimeAgo(activity.timestamp) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campaign Performance -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h3 class="text-lg font-semibold text-foreground mb-4">Campaign Performance</h3>
              <div class="space-y-4">
                <div 
                  v-for="campaign in activeCampaigns" 
                  :key="campaign.id"
                  class="p-3 rounded-lg border border-border"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-foreground">
                      {{ campaign.name }}
                    </h4>
                    <StatusBadge :status="getCampaignStatus(campaign.status)" />
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-muted-foreground">Applications:</span>
                      <span class="font-medium text-foreground ml-1">
                        {{ campaign.metrics.totalApplications }}
                      </span>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Response Rate:</span>
                      <span class="font-medium text-foreground ml-1">
                        {{ campaign.metrics.responseRate }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jobs Overview -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Active Jobs -->
            <div class="bg-card rounded-lg border border-border">
              <div class="p-6 border-b border-border">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-foreground">Active Jobs</h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/client/jobs')">
                    View All
                  </Button>
                </div>
              </div>
              <div class="p-6">
                <div v-if="activeJobs.length === 0" class="text-center py-8">
                  <BriefcaseIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 class="text-sm font-medium text-foreground mb-2">No active jobs</h4>
                  <p class="text-xs text-muted-foreground mb-4">
                    Create your first job posting to get started
                  </p>
                  <Button variant="primary" size="sm" @click="$router.push('/client/jobs/create')">
                    Create Job
                  </Button>
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="job in activeJobs" 
                    :key="job.id"
                    class="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer"
                    @click="$router.push(`/client/jobs/${job.id}`)"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="text-sm font-medium text-foreground">
                        {{ job.title }}
                      </h4>
                      <StatusBadge :status="getJobStatus(job.status)" />
                    </div>
                    <p class="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {{ job.description }}
                    </p>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-muted-foreground">
                        {{ job.totalApplications }} applications
                      </span>
                      <span class="text-foreground font-medium">
                        ${{ job.budget.min.toLocaleString() }} - ${{ job.budget.max.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Applications -->
            <div class="bg-card rounded-lg border border-border">
              <div class="p-6 border-b border-border">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-foreground">Recent Applications</h3>
                  <Button variant="ghost" size="sm" @click="$router.push('/client/jobs')">
                    View All
                  </Button>
                </div>
              </div>
              <div class="p-6">
                <div v-if="recentApplications.length === 0" class="text-center py-8">
                  <EmailIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 class="text-sm font-medium text-foreground mb-2">No applications yet</h4>
                  <p class="text-xs text-muted-foreground">
                    Applications will appear here once you post jobs
                  </p>
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="application in recentApplications" 
                    :key="application.id"
                    class="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer"
                    @click="$router.push(`/client/jobs/${application.jobId}`)"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h4 class="text-sm font-medium text-foreground">
                          {{ application.voiceActorName }}
                        </h4>
                        <p class="text-xs text-muted-foreground">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VoiceClient, ClientStats, JobPosting, JobApplication, Campaign } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
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
const campaigns = ref<Campaign[]>(mockClientData.campaigns)

// Computed
const recentActivity = computed(() => stats.value.recentActivity.slice(0, 5))

const activeJobs = computed(() => 
  jobPostings.value.filter(job => job.status === 'active').slice(0, 3)
)

const recentApplications = computed(() => 
  applications.value
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 3)
)

const activeCampaigns = computed(() => 
  campaigns.value.filter(campaign => campaign.status === 'active').slice(0, 2)
)

// Methods
const getCampaignStatus = (status: string) => {
  switch (status) {
    case 'active': return 'active'
    case 'paused': return 'inactive'
    case 'completed': return 'completed'
    case 'cancelled': return 'rejected'
    default: return 'draft'
  }
}

const getJobStatus = (status: string) => {
  switch (status) {
    case 'active': return 'active'
    case 'published': return 'active'
    case 'paused': return 'inactive'
    case 'closed': return 'inactive'
    case 'completed': return 'completed'
    case 'cancelled': return 'rejected'
    default: return 'draft'
  }
}

const getApplicationStatus = (status: string) => {
  switch (status) {
    case 'submitted': return 'pending'
    case 'under_review': return 'processing'
    case 'shortlisted': return 'success'
    case 'selected': return 'success'
    case 'rejected': return 'rejected'
    default: return 'draft'
  }
}

const getJobTitle = (jobId: string) => {
  const job = jobPostings.value.find(j => j.id === jobId)
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

onMounted(() => {
  // In real app, fetch client data from API
  console.log('Client dashboard loaded')
})
</script>
