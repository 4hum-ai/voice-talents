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
              <Button variant="ghost" size="sm" @click="goBack" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  Account Settings
                </h1>
                <p class="text-sm text-muted-foreground">
                  Manage your client account and preferences
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="saveSettings" class="space-y-8">
            <!-- Account Information -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Account Information</h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Company Name *
                  </label>
                  <input
                    v-model="settings.companyName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Contact Name *
                  </label>
                  <input
                    v-model="settings.contactName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    v-model="settings.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    v-model="settings.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Website
                  </label>
                  <input
                    v-model="settings.website"
                    type="url"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Industry
                  </label>
                  <SelectInput
                    v-model="settings.industry"
                    :options="industryOptions"
                    placeholder="Select industry"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Company Size
                  </label>
                  <SelectInput
                    v-model="settings.companySize"
                    :options="companySizeOptions"
                    placeholder="Select company size"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Timezone
                  </label>
                  <SelectInput
                    v-model="settings.timezone"
                    :options="timezoneOptions"
                    placeholder="Select timezone"
                  />
                </div>
              </div>
              <div class="mt-6">
                <label class="block text-sm font-medium text-foreground mb-2">
                  Company Description
                </label>
                <textarea
                  v-model="settings.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your company and what you do..."
                />
              </div>
            </div>

            <!-- Job Defaults -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Job Posting Defaults</h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Default Budget Range
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        v-model.number="settings.defaults.budget.min"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <input
                        v-model.number="settings.defaults.budget.max"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Default Currency
                  </label>
                  <SelectInput
                    v-model="settings.defaults.budget.currency"
                    :options="currencyOptions"
                    placeholder="Select currency"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Preferred Languages
                  </label>
                  <SelectInput
                    v-model="settings.defaults.languages"
                    :options="languageOptions"
                    placeholder="Select languages"
                    multiple
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Preferred Voice Types
                  </label>
                  <SelectInput
                    v-model="settings.defaults.voiceTypes"
                    :options="voiceTypeOptions"
                    placeholder="Select voice types"
                    multiple
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Default Job Type
                  </label>
                  <SelectInput
                    v-model="settings.defaults.jobType"
                    :options="jobTypeOptions"
                    placeholder="Select default job type"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Default Priority
                  </label>
                  <SelectInput
                    v-model="settings.defaults.priority"
                    :options="priorityOptions"
                    placeholder="Select default priority"
                  />
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Job Preferences</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">Auto-approve Applications</h3>
                    <p class="text-sm text-muted-foreground">Automatically approve applications that meet your criteria</p>
                  </div>
                  <input
                    v-model="settings.preferences.autoApprove"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">Require NDA</h3>
                    <p class="text-sm text-muted-foreground">Require voice actors to sign an NDA before starting work</p>
                  </div>
                  <input
                    v-model="settings.preferences.requireNDA"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">Require Portfolio</h3>
                    <p class="text-sm text-muted-foreground">Only allow voice actors with portfolios to apply</p>
                  </div>
                  <input
                    v-model="settings.preferences.requirePortfolio"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-foreground">Public Profile</h3>
                    <p class="text-sm text-muted-foreground">Make your company profile visible to voice actors</p>
                  </div>
                  <input
                    v-model="settings.isPublic"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                </div>
              </div>
            </div>


            <!-- Social Links -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold text-foreground mb-6">Social Links</h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    LinkedIn
                  </label>
                  <input
                    v-model="settings.socialLinks.linkedin"
                    type="url"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Facebook Page
                  </label>
                  <input
                    v-model="settings.socialLinks.facebook"
                    type="url"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Twitter
                  </label>
                  <input
                    v-model="settings.socialLinks.twitter"
                    type="url"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4">
              <Button type="button" variant="outline" @click="resetSettings">
                Reset to Defaults
              </Button>
              <Button type="submit" variant="primary" :disabled="isSaving">
                <SaveIcon class="h-4 w-4 mr-2" />
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceClient } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import ArrowLeftIcon from '~icons/mdi/arrow-left'
import SaveIcon from '~icons/mdi/content-save'

const router = useRouter()

// State
const isSaving = ref(false)
const currentClient = ref<VoiceClient>(mockClientData.voiceClients[0])

// Settings form
const settings = reactive({
  // Account Information
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  companySize: '',
  timezone: '',
  description: '',
  isPublic: true,
  
  // Job Defaults
  defaults: {
    budget: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    languages: [] as string[],
    voiceTypes: [] as string[],
    jobType: 'open_casting',
    priority: 'medium'
  },
  
  // Preferences
  preferences: {
    autoApprove: false,
    requireNDA: false,
    requirePortfolio: true
  },
  
  
  // Social Links
  socialLinks: {
    linkedin: '',
    facebook: '',
    twitter: ''
  }
})

// Options
const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'advertising', label: 'Advertising & Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment & Media' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
]

const companySizeOptions = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
]

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' }
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Dutch', label: 'Dutch' }
]

const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' }
]

const jobTypeOptions = [
  { value: 'open_casting', label: 'Open Casting' },
  { value: 'invite_only', label: 'Invite Only' },
  { value: 'urgent_fill', label: 'Urgent Fill' },
  { value: 'targeted_search', label: 'Targeted Search' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]


// Methods
const goBack = () => {
  router.back()
}

const loadSettings = () => {
  // Load current client settings
  const client = currentClient.value
  settings.companyName = client.companyName
  settings.contactName = client.contactName
  settings.email = client.email
  settings.phone = client.phone || ''
  settings.website = client.website || ''
  settings.industry = client.industry
  settings.companySize = client.companySize
  settings.timezone = client.timezone
  settings.description = client.description || ''
  settings.isPublic = client.isPublic
  
  // Load preferences
  settings.defaults.budget = { ...client.preferences.defaultBudget }
  settings.defaults.languages = [...client.preferences.preferredLanguages]
  settings.defaults.voiceTypes = [...client.preferences.preferredVoiceTypes]
  settings.preferences.autoApprove = client.preferences.autoApprove
  settings.preferences.requireNDA = client.preferences.requireNDA
  settings.preferences.requirePortfolio = true // Default value
  
  // Load social links
  settings.socialLinks.linkedin = client.socialLinks.linkedin || ''
  settings.socialLinks.facebook = client.socialLinks.facebook || ''
  settings.socialLinks.twitter = client.socialLinks.twitter || ''
}

const resetSettings = () => {
  loadSettings()
}

const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // In real app, save settings to API
    const updatedClient: VoiceClient = {
      ...currentClient.value,
      companyName: settings.companyName,
      contactName: settings.contactName,
      email: settings.email,
      phone: settings.phone,
      website: settings.website,
      industry: settings.industry,
      companySize: settings.companySize as any,
      timezone: settings.timezone,
      description: settings.description,
      isPublic: settings.isPublic,
      preferences: {
        defaultBudget: settings.defaults.budget,
        preferredLanguages: settings.defaults.languages,
        preferredVoiceTypes: settings.defaults.voiceTypes,
        autoApprove: settings.preferences.autoApprove,
        requireNDA: settings.preferences.requireNDA
      },
      socialLinks: {
        website: settings.website,
        linkedin: settings.socialLinks.linkedin,
        facebook: settings.socialLinks.facebook,
        twitter: settings.socialLinks.twitter
      }
    }
    
    console.log('Saving client settings:', updatedClient)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update local data
    currentClient.value = updatedClient
    
    // Show success message
    console.log('Settings saved successfully!')
    
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>