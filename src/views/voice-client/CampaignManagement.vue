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
                  Campaign Management
                </h1>
                <p class="text-sm text-muted-foreground">
                  Manage your talent acquisition campaigns
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="primary" size="sm" @click="$router.push('/client/campaigns/create')">
                <PlusIcon class="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Campaign Types Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-card rounded-lg border border-border p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MegaphoneIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Fill ASAP</h3>
                  <p class="text-sm text-muted-foreground">Open casting calls</p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mb-4">
                Create open casting calls for immediate talent acquisition. Perfect for urgent projects or when you want to cast a wide net.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('fill_asap')">
                Create Fill ASAP Campaign
              </Button>
            </div>

            <div class="bg-card rounded-lg border border-border p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <EmailIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Invite Specific</h3>
                  <p class="text-sm text-muted-foreground">Targeted invitations</p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mb-4">
                Send direct invitations to specific voice actors you want to work with. Ideal for established relationships or preferred talent.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('invite_specific')">
                Create Invite Campaign
              </Button>
            </div>

            <div class="bg-card rounded-lg border border-border p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TargetIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Custom Campaign</h3>
                  <p class="text-sm text-muted-foreground">Flexible targeting</p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mb-4">
                Create custom campaigns with specific targeting criteria. Combine multiple strategies for complex projects.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('custom')">
                Create Custom Campaign
              </Button>
            </div>
          </div>

          <!-- Active Campaigns -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-foreground">Active Campaigns</h2>
              <div class="flex items-center space-x-2">
                <SelectInput v-model="statusFilter" :options="statusOptions" placeholder="Filter by status" class="w-40" />
                <Button variant="outline" size="sm" @click="refreshCampaigns">
                  <RefreshIcon class="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div v-if="filteredCampaigns.length === 0" class="text-center py-12">
              <MegaphoneIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 class="text-lg font-medium text-foreground mb-2">
                No campaigns found
              </h3>
              <p class="text-muted-foreground mb-6">
                {{ statusFilter ? 'Try adjusting your filter criteria' : 'Create your first campaign to get started' }}
              </p>
              <Button variant="primary" @click="$router.push('/client/campaigns/create')">
                <PlusIcon class="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                v-for="campaign in filteredCampaigns" 
                :key="campaign.id"
                class="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <!-- Campaign Header -->
                <div class="p-6 border-b border-border">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-foreground mb-1">
                        {{ campaign.name }}
                      </h3>
                      <p class="text-sm text-muted-foreground">
                        {{ getCampaignTypeLabel(campaign.type) }}
                      </p>
                    </div>
                    <div class="flex-shrink-0 ml-4">
                      <StatusBadge :status="getCampaignStatus(campaign.status)" />
                    </div>
                  </div>

                  <p class="text-sm text-muted-foreground line-clamp-2">
                    {{ campaign.description }}
                  </p>
                </div>

                <!-- Campaign Metrics -->
                <div class="p-6">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-foreground">
                        {{ campaign.metrics.totalApplications }}
                      </div>
                      <div class="text-xs text-muted-foreground">Applications</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-foreground">
                        {{ campaign.metrics.responseRate }}%
                      </div>
                      <div class="text-xs text-muted-foreground">Response Rate</div>
                    </div>
                  </div>

                  <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Budget</span>
                      <span class="text-foreground font-medium">
                        ${{ campaign.budget.spent.toLocaleString() }} / ${{ campaign.budget.total.toLocaleString() }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Jobs</span>
                      <span class="text-foreground font-medium">
                        {{ campaign.jobs.length }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Invitations</span>
                      <span class="text-foreground font-medium">
                        {{ campaign.invitations.length }}
                      </span>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="mb-4">
                    <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Budget Usage</span>
                      <span>{{ Math.round((campaign.budget.spent / campaign.budget.total) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-2">
                      <div 
                        class="bg-primary h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((campaign.budget.spent / campaign.budget.total) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="px-6 pb-6">
                  <div class="flex items-center justify-between">
                    <div class="flex space-x-2">
                      <Button variant="ghost" size="sm" @click="$router.push(`/client/campaigns/${campaign.id}`)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" @click="editCampaign(campaign)">
                        <EditIcon class="h-4 w-4" />
                      </Button>
                    </div>
                    <div class="flex space-x-2">
                      <Button 
                        v-if="campaign.status === 'active'"
                        variant="outline" 
                        size="sm" 
                        @click="pauseCampaign(campaign.id)"
                      >
                        <PauseIcon class="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button 
                        v-else-if="campaign.status === 'paused'"
                        variant="primary" 
                        size="sm" 
                        @click="resumeCampaign(campaign.id)"
                      >
                        <PlayIcon class="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaign Performance Summary -->
          <div class="bg-card rounded-lg border border-border p-6">
            <h2 class="text-xl font-semibold text-foreground mb-6">Campaign Performance Summary</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-foreground mb-2">
                  {{ totalApplications }}
                </div>
                <div class="text-sm text-muted-foreground">Total Applications</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-foreground mb-2">
                  {{ averageResponseRate }}%
                </div>
                <div class="text-sm text-muted-foreground">Avg Response Rate</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-foreground mb-2">
                  ${{ totalSpent.toLocaleString() }}
                </div>
                <div class="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-foreground mb-2">
                  {{ totalHires }}
                </div>
                <div class="text-sm text-muted-foreground">Total Hires</div>
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
import { useRouter } from 'vue-router'
import type { Campaign } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import PlusIcon from '~icons/mdi/plus'
import MegaphoneIcon from '~icons/mdi/megaphone'
import EmailIcon from '~icons/mdi/email'
import TargetIcon from '~icons/mdi/target'
import RefreshIcon from '~icons/mdi/refresh'
import EyeIcon from '~icons/mdi/eye'
import EditIcon from '~icons/mdi/pencil'
import PauseIcon from '~icons/mdi/pause'
import PlayIcon from '~icons/mdi/play'

const router = useRouter()

// State
const statusFilter = ref('')
const campaigns = ref<Campaign[]>(mockClientData.campaigns)

// Computed
const filteredCampaigns = computed(() => {
  if (!statusFilter.value) return campaigns.value
  return campaigns.value.filter(campaign => campaign.status === statusFilter.value)
})

const totalApplications = computed(() => 
  campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.totalApplications, 0)
)

const averageResponseRate = computed(() => {
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.responseRate, 0)
  return Math.round(totalRate / campaigns.value.length)
})

const totalSpent = computed(() => 
  campaigns.value.reduce((sum, campaign) => sum + campaign.budget.spent, 0)
)

const totalHires = computed(() => 
  campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.talentEngagement.hires, 0)
)

// Options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Methods
const getCampaignTypeLabel = (type: string) => {
  switch (type) {
    case 'fill_asap': return 'Fill ASAP'
    case 'invite_specific': return 'Invite Specific'
    case 'targeted_search': return 'Targeted Search'
    case 'custom': return 'Custom Campaign'
    default: return type
  }
}

const getCampaignStatus = (status: string) => {
  switch (status) {
    case 'active': return 'active'
    case 'paused': return 'inactive'
    case 'completed': return 'completed'
    case 'cancelled': return 'rejected'
    default: return 'draft'
  }
}

const createCampaign = (type: string) => {
  router.push(`/client/campaigns/create?type=${type}`)
}

const editCampaign = (campaign: Campaign) => {
  router.push(`/client/campaigns/${campaign.id}/edit`)
}

const pauseCampaign = (campaignId: string) => {
  // In real app, pause campaign via API
  const campaign = campaigns.value.find(c => c.id === campaignId)
  if (campaign) {
    campaign.status = 'paused'
  }
  console.log('Pausing campaign:', campaignId)
}

const resumeCampaign = (campaignId: string) => {
  // In real app, resume campaign via API
  const campaign = campaigns.value.find(c => c.id === campaignId)
  if (campaign) {
    campaign.status = 'active'
  }
  console.log('Resuming campaign:', campaignId)
}

const refreshCampaigns = () => {
  // In real app, fetch fresh data from API
  console.log('Refreshing campaigns...')
}

onMounted(() => {
  // In real app, fetch campaigns from API
  console.log('Campaign management loaded')
})
</script>
