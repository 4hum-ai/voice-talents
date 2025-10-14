<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <AppBar :show-back="true" @back="goBack">
        <template #title>Create Campaign</template>
        <template #subtitle>Set up a new talent acquisition campaign</template>
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <form @submit.prevent="createCampaign" class="space-y-8">
            <!-- Campaign Type Selection -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Campaign Type</h2>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div v-for="type in campaignTypes" :key="type.value" class="relative">
                  <input
                    :id="type.value"
                    v-model="form.type"
                    type="radio"
                    :value="type.value"
                    class="sr-only"
                  />
                  <label
                    :for="type.value"
                    class="flex cursor-pointer items-start rounded-lg border-2 p-4 transition-all"
                    :class="
                      form.type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    "
                  >
                    <div class="flex-1">
                      <div class="mb-2 flex items-center space-x-3">
                        <component :is="type.icon" class="text-primary h-5 w-5" />
                        <h3 class="text-foreground font-medium">{{ type.label }}</h3>
                      </div>
                      <p class="text-muted-foreground text-sm">{{ type.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Basic Campaign Information -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Campaign Details</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label for="name" class="text-foreground mb-2 block text-sm font-medium">
                    Campaign Name *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g., Q1 Voice Over Campaign"
                  />
                </div>
                <div>
                  <label for="priority" class="text-foreground mb-2 block text-sm font-medium">
                    Priority
                  </label>
                  <SelectInput
                    v-model="form.priority"
                    :options="priorityOptions"
                    placeholder="Select priority"
                  />
                </div>
              </div>
              <div class="mt-6">
                <label for="description" class="text-foreground mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Describe your campaign goals and requirements..."
                />
              </div>
            </div>

            <!-- Budget & Timeline -->
            <FormSection
              title="Budget & Timeline"
              description="Set your campaign budget and timeline"
              icon="mdi:currency-usd"
              icon-color="green"
              :columns="2"
            >
              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label for="budget" class="text-foreground mb-2 block text-sm font-medium">
                    Total Budget *
                  </label>
                  <input
                    id="budget"
                    v-model.number="form.budget"
                    type="number"
                    required
                    min="0"
                    step="100"
                    class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label for="currency" class="text-foreground mb-2 block text-sm font-medium">
                    Currency
                  </label>
                  <SelectInput
                    v-model="form.currency"
                    :options="currencyOptions"
                    placeholder="Select currency"
                  />
                </div>
                <div>
                  <label for="duration" class="text-foreground mb-2 block text-sm font-medium">
                    Duration
                  </label>
                  <SelectInput
                    v-model="form.duration"
                    :options="durationOptions"
                    placeholder="Select duration"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label for="startDate" class="text-foreground mb-2 block text-sm font-medium">
                    Start Date *
                  </label>
                  <input
                    id="startDate"
                    v-model="form.startDate"
                    type="date"
                    required
                    class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label for="endDate" class="text-foreground mb-2 block text-sm font-medium">
                    End Date *
                  </label>
                  <input
                    id="endDate"
                    v-model="form.endDate"
                    type="date"
                    required
                    class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            </FormSection>

            <!-- Target Audience -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Target Audience</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label for="languages" class="text-foreground mb-2 block text-sm font-medium">
                    Languages *
                  </label>
                  <SelectInput
                    v-model="form.target.languages"
                    :options="languageOptions"
                    placeholder="Select languages"
                    multiple
                  />
                </div>
                <div>
                  <label for="voiceTypes" class="text-foreground mb-2 block text-sm font-medium">
                    Voice Types *
                  </label>
                  <SelectInput
                    v-model="form.target.voiceTypes"
                    :options="voiceTypeOptions"
                    placeholder="Select voice types"
                    multiple
                  />
                </div>
              </div>
              <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label for="experience" class="text-foreground mb-2 block text-sm font-medium">
                    Experience Level
                  </label>
                  <SelectInput
                    v-model="form.target.experience"
                    :options="experienceOptions"
                    placeholder="Select experience level"
                  />
                </div>
                <div>
                  <label for="minRating" class="text-foreground mb-2 block text-sm font-medium">
                    Minimum Rating
                  </label>
                  <SelectInput
                    v-model="form.target.minRating"
                    :options="ratingOptions"
                    placeholder="Select minimum rating"
                  />
                </div>
              </div>
              <div class="mt-6">
                <label for="customCriteria" class="text-foreground mb-2 block text-sm font-medium">
                  Custom Criteria
                </label>
                <textarea
                  id="customCriteria"
                  v-model="form.target.customCriteria"
                  rows="3"
                  class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Any specific requirements or preferences..."
                />
              </div>
            </div>

            <!-- Campaign Settings -->
            <div class="bg-card border-border rounded-lg border p-6">
              <h2 class="text-foreground mb-4 text-lg font-semibold">Campaign Settings</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-foreground text-sm font-medium">Auto-approve Applications</h3>
                    <p class="text-muted-foreground text-sm">
                      Automatically approve applications that meet criteria
                    </p>
                  </div>
                  <input
                    v-model="form.settings.autoApprove"
                    type="checkbox"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-foreground text-sm font-medium">Require Portfolio</h3>
                    <p class="text-muted-foreground text-sm">
                      Require voice actors to have a portfolio
                    </p>
                  </div>
                  <input
                    v-model="form.settings.requirePortfolio"
                    type="checkbox"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-foreground text-sm font-medium">Require Custom Sample</h3>
                    <p class="text-muted-foreground text-sm">
                      Require custom voice samples for this campaign
                    </p>
                  </div>
                  <input
                    v-model="form.settings.requireCustomSample"
                    type="checkbox"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-foreground text-sm font-medium">Allow Multiple Applications</h3>
                    <p class="text-muted-foreground text-sm">
                      Allow voice actors to apply to multiple jobs
                    </p>
                  </div>
                  <input
                    v-model="form.settings.allowMultipleApplications"
                    type="checkbox"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                </div>
              </div>
              <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    for="notificationFrequency"
                    class="text-foreground mb-2 block text-sm font-medium"
                  >
                    Notification Frequency
                  </label>
                  <SelectInput
                    v-model="form.settings.notificationFrequency"
                    :options="notificationOptions"
                    placeholder="Select frequency"
                  />
                </div>
                <div>
                  <label for="privacyLevel" class="text-foreground mb-2 block text-sm font-medium">
                    Privacy Level
                  </label>
                  <SelectInput
                    v-model="form.settings.privacyLevel"
                    :options="privacyOptions"
                    placeholder="Select privacy level"
                  />
                </div>
              </div>
            </div>

            <!-- Job Selection (for campaigns with specific jobs) -->
            <div
              v-if="form.type === 'invite_specific' || form.type === 'custom'"
              class="bg-card border-border rounded-lg border p-6"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold">Associated Jobs</h2>
              <div class="space-y-3">
                <div
                  v-for="job in availableJobs"
                  :key="job.id"
                  class="border-border flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <h3 class="text-foreground font-medium">{{ job.title }}</h3>
                    <p class="text-muted-foreground text-sm">{{ job.description }}</p>
                  </div>
                  <input
                    :id="job.id"
                    v-model="form.jobs"
                    type="checkbox"
                    :value="job.id"
                    class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                  />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4">
              <Button type="button" variant="outline" @click="goBack"> Cancel </Button>
              <Button type="submit" variant="primary" :disabled="!isFormValid">
                <PlusIcon class="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Campaign, CampaignType, CampaignTarget, CampaignSettings } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import FormSection from '@/components/molecules/FormSection.vue'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import PlusIcon from '~icons/mdi/plus'
import MegaphoneIcon from '~icons/mdi/megaphone'
import EmailIcon from '~icons/mdi/email'
import TargetIcon from '~icons/mdi/target'
import AccountGroupIcon from '~icons/mdi/account-group'

const router = useRouter()
const route = useRoute()

// State
const form = ref({
  type: '' as CampaignType,
  name: '',
  description: '',
  priority: 'medium',
  budget: 0,
  currency: 'USD',
  duration: '1_month',
  startDate: '',
  endDate: '',
  target: {
    languages: [] as string[],
    voiceTypes: [] as string[],
    experience: '',
    minRating: 0,
    customCriteria: '',
  } as CampaignTarget,
  settings: {
    autoApprove: false,
    requirePortfolio: true,
    requireCustomSample: false,
    allowMultipleApplications: true,
    notificationFrequency: 'daily' as 'immediate' | 'daily' | 'weekly',
    privacyLevel: 'public' as 'public' | 'private' | 'invite_only',
    ndaRequired: false,
  } as CampaignSettings,
  jobs: [] as string[],
})

// Computed
const isFormValid = computed(() => {
  return (
    form.value.type &&
    form.value.name &&
    form.value.budget > 0 &&
    form.value.startDate &&
    form.value.endDate &&
    form.value.target.languages.length > 0 &&
    form.value.target.voiceTypes.length > 0
  )
})

const availableJobs = computed(() => mockClientData.jobPostings)

// Campaign Types
const campaignTypes = [
  {
    value: 'fill_asap',
    label: 'Fill ASAP',
    description: 'Open casting calls for immediate talent acquisition',
    icon: MegaphoneIcon,
  },
  {
    value: 'invite_specific',
    label: 'Invite Specific',
    description: 'Targeted invitations to preferred voice actors',
    icon: EmailIcon,
  },
  {
    value: 'targeted_search',
    label: 'Targeted Search',
    description: 'Filter-based talent discovery and outreach',
    icon: TargetIcon,
  },
  {
    value: 'custom',
    label: 'Custom Campaign',
    description: 'Flexible targeting with specific requirements',
    icon: AccountGroupIcon,
  },
]

// Options
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
]

const durationOptions = [
  { value: '1_week', label: '1 Week' },
  { value: '2_weeks', label: '2 Weeks' },
  { value: '1_month', label: '1 Month' },
  { value: '2_months', label: '2 Months' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
]

const voiceTypeOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'child', label: 'Child' },
  { value: 'teen', label: 'Teen' },
  { value: 'senior', label: 'Senior' },
  { value: 'neutral', label: 'Neutral' },
]

const experienceOptions = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'experienced', label: 'Experienced (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' },
]

const ratingOptions = [
  { value: 0, label: 'No minimum' },
  { value: 3, label: '3+ stars' },
  { value: 4, label: '4+ stars' },
  { value: 4.5, label: '4.5+ stars' },
  { value: 5, label: '5 stars only' },
]

const notificationOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]

const privacyOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'invite_only', label: 'Invite Only' },
]

// Methods
const goBack = () => {
  router.back()
}

const createCampaign = () => {
  if (!isFormValid.value) return

  const newCampaign: Campaign = {
    id: `campaign_${Date.now()}`,
    clientId: 'client_1',
    clientName: 'Acme Productions',
    name: form.value.name,
    description: form.value.description,
    type: form.value.type,
    status: 'draft',
    priority: form.value.priority as 'low' | 'medium' | 'high' | 'urgent',
    budget: {
      total: form.value.budget,
      spent: 0,
      currency: form.value.currency as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD',
    },
    timeline: {
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      duration: form.value.duration,
    },
    jobs: form.value.jobs,
    invitations: [],
    metrics: {
      totalViews: 0,
      totalApplications: 0,
      totalInvitations: 0,
      responseRate: 0,
      conversionRate: 0,
      averageResponseTime: 0,
      topPerformingJobs: [],
      talentEngagement: {
        views: 0,
        applications: 0,
        shortlists: 0,
        hires: 0,
      },
    },
    settings: form.value.settings,
    createdDate: new Date().toISOString(),
    target: form.value.target,
  }

  // In real app, save to API
  console.log('Creating campaign:', newCampaign)

  // Add to mock data
  mockClientData.campaigns.push(newCampaign)

  // Navigate to campaign management
  router.push('/client/campaigns')
}

onMounted(() => {
  // Set campaign type from URL parameter if provided
  const typeParam = route.query.type as string
  if (typeParam && campaignTypes.some((t) => t.value === typeParam)) {
    form.value.type = typeParam as CampaignType
  }

  // Set default dates
  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  form.value.startDate = today.toISOString().split('T')[0]
  form.value.endDate = nextMonth.toISOString().split('T')[0]
})
</script>
