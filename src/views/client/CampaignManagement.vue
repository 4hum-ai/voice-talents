<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Campaign Management</template>
        <template #subtitle>Manage your talent acquisition campaigns</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="primary" size="sm" @click="$router.push('/client/campaigns/create')">
            <PlusIcon class="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Campaign Types Overview -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="bg-card border-border rounded-lg border p-6">
              <div class="mb-4 flex items-center space-x-3">
                <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <MegaphoneIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-foreground text-lg font-semibold">Fill ASAP</h3>
                  <p class="text-muted-foreground text-sm">Open casting calls</p>
                </div>
              </div>
              <p class="text-muted-foreground mb-4 text-sm">
                Create open casting calls for immediate talent acquisition. Perfect for urgent
                projects or when you want to cast a wide net.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('fill_asap')">
                Create Fill ASAP Campaign
              </Button>
            </div>

            <div class="bg-card border-border rounded-lg border p-6">
              <div class="mb-4 flex items-center space-x-3">
                <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <EmailIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-foreground text-lg font-semibold">Invite Specific</h3>
                  <p class="text-muted-foreground text-sm">Targeted invitations</p>
                </div>
              </div>
              <p class="text-muted-foreground mb-4 text-sm">
                Send direct invitations to specific voice actors you want to work with. Ideal for
                established relationships or preferred talent.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('invite_specific')">
                Create Invite Campaign
              </Button>
            </div>

            <div class="bg-card border-border rounded-lg border p-6">
              <div class="mb-4 flex items-center space-x-3">
                <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                  <TargetIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="text-foreground text-lg font-semibold">Custom Campaign</h3>
                  <p class="text-muted-foreground text-sm">Flexible targeting</p>
                </div>
              </div>
              <p class="text-muted-foreground mb-4 text-sm">
                Create custom campaigns with specific targeting criteria. Combine multiple
                strategies for complex projects.
              </p>
              <Button variant="outline" size="sm" @click="createCampaign('custom')">
                Create Custom Campaign
              </Button>
            </div>
          </div>

          <!-- Active Campaigns -->
          <div class="mb-8">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-foreground text-xl font-semibold">Active Campaigns</h2>
              <div class="flex items-center space-x-2">
                <SelectInput
                  v-model="statusFilter"
                  :options="statusOptions"
                  placeholder="Filter by status"
                  class="w-40"
                />
                <Button variant="outline" size="sm" @click="refreshCampaigns">
                  <RefreshIcon class="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div v-if="filteredCampaigns.length === 0" class="py-12 text-center">
              <MegaphoneIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 class="text-foreground mb-2 text-lg font-medium">No campaigns found</h3>
              <p class="text-muted-foreground mb-6">
                {{
                  statusFilter
                    ? 'Try adjusting your filter criteria'
                    : 'Create your first campaign to get started'
                }}
              </p>
              <Button variant="primary" @click="$router.push('/client/campaigns/create')">
                <PlusIcon class="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>

            <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div
                v-for="campaign in filteredCampaigns"
                :key="campaign.id"
                class="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                <!-- Campaign Header -->
                <div class="border-border border-b p-6">
                  <div class="mb-3 flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-foreground mb-1 text-lg font-semibold">
                        {{ campaign.name }}
                      </h3>
                      <p class="text-muted-foreground text-sm">
                        {{ getCampaignTypeLabel(campaign.type) }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <StatusBadge :status="getCampaignStatus(campaign.status)" />
                    </div>
                  </div>

                  <p class="text-muted-foreground line-clamp-2 text-sm">
                    {{ campaign.description }}
                  </p>
                </div>

                <!-- Campaign Metrics -->
                <div class="p-6">
                  <div class="mb-4 grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <div class="text-foreground text-2xl font-bold">
                        {{ campaign.metrics.totalApplications }}
                      </div>
                      <div class="text-muted-foreground text-xs">Applications</div>
                    </div>
                    <div class="text-center">
                      <div class="text-foreground text-2xl font-bold">
                        {{ campaign.metrics.responseRate }}%
                      </div>
                      <div class="text-muted-foreground text-xs">Response Rate</div>
                    </div>
                  </div>

                  <div class="mb-4 space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Budget</span>
                      <span class="text-foreground font-medium">
                        ${{ campaign.budget.spent.toLocaleString() }} / ${{
                          campaign.budget.total.toLocaleString()
                        }}
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
                    <div
                      class="text-muted-foreground mb-1 flex items-center justify-between text-xs"
                    >
                      <span>Budget Usage</span>
                      <span
                        >{{
                          Math.round((campaign.budget.spent / campaign.budget.total) * 100)
                        }}%</span
                      >
                    </div>
                    <div class="bg-muted h-2 w-full rounded-full">
                      <div
                        class="bg-primary h-2 rounded-full transition-all duration-300"
                        :style="{
                          width: `${Math.min((campaign.budget.spent / campaign.budget.total) * 100, 100)}%`,
                        }"
                      ></div>
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
                        @click="$router.push(`/client/campaigns/${campaign.id}`)"
                      >
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
                        <PauseIcon class="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                      <Button
                        v-else-if="campaign.status === 'paused'"
                        variant="primary"
                        size="sm"
                        @click="resumeCampaign(campaign.id)"
                      >
                        <PlayIcon class="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaign Performance Summary -->
          <div class="bg-card border-border rounded-lg border p-6">
            <h2 class="text-foreground mb-6 text-xl font-semibold">Campaign Performance Summary</h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div class="text-center">
                <div class="text-foreground mb-2 text-3xl font-bold">
                  {{ totalApplications }}
                </div>
                <div class="text-muted-foreground text-sm">Total Applications</div>
              </div>
              <div class="text-center">
                <div class="text-foreground mb-2 text-3xl font-bold">
                  {{ averageResponseRate }}%
                </div>
                <div class="text-muted-foreground text-sm">Avg Response Rate</div>
              </div>
              <div class="text-center">
                <div class="text-foreground mb-2 text-3xl font-bold">
                  ${{ totalSpent.toLocaleString() }}
                </div>
                <div class="text-muted-foreground text-sm">Total Spent</div>
              </div>
              <div class="text-center">
                <div class="text-foreground mb-2 text-3xl font-bold">
                  {{ totalHires }}
                </div>
                <div class="text-muted-foreground text-sm">Total Hires</div>
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
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
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
  return campaigns.value.filter((campaign) => campaign.status === statusFilter.value)
})

const totalApplications = computed(() =>
  campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.totalApplications, 0),
)

const averageResponseRate = computed(() => {
  if (campaigns.value.length === 0) return 0
  const totalRate = campaigns.value.reduce(
    (sum, campaign) => sum + campaign.metrics.responseRate,
    0,
  )
  return Math.round(totalRate / campaigns.value.length)
})

const totalSpent = computed(() =>
  campaigns.value.reduce((sum, campaign) => sum + campaign.budget.spent, 0),
)

const totalHires = computed(() =>
  campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.talentEngagement.hires, 0),
)

// Options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Methods
const getCampaignTypeLabel = (type: string) => {
  switch (type) {
    case 'fill_asap':
      return 'Fill ASAP'
    case 'invite_specific':
      return 'Invite Specific'
    case 'targeted_search':
      return 'Targeted Search'
    case 'custom':
      return 'Custom Campaign'
    default:
      return type
  }
}

const getCampaignStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'active'
    case 'paused':
      return 'inactive'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'rejected'
    default:
      return 'draft'
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
  const campaign = campaigns.value.find((c) => c.id === campaignId)
  if (campaign) {
    campaign.status = 'paused'
  }
  console.log('Pausing campaign:', campaignId)
}

const resumeCampaign = (campaignId: string) => {
  // In real app, resume campaign via API
  const campaign = campaigns.value.find((c) => c.id === campaignId)
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
