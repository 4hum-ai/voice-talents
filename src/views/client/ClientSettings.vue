<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header with Stepper -->
      <AppBar :show-back="true" @back="goBack">
        <template #title>Client Settings</template>
        <template #subtitle>Manage your client account settings and preferences</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="resetSettings">
            <RefreshIcon class="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </template>
      </AppBar>

      <div class="bg-card border-border border-b shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8">
          <!-- Stepper Navigation -->
          <div class="border-border border-t py-4">
            <div class="flex items-center justify-between">
              <!-- Previous Button -->
              <Button
                v-if="currentStep > 1"
                variant="outline"
                size="sm"
                @click="previousStep"
                :disabled="!canGoBack"
              >
                <ArrowLeftIcon class="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div v-else class="w-20" />

              <!-- Progress Indicator -->
              <div class="flex items-center space-x-4">
                <div class="text-muted-foreground text-sm">
                  Step {{ currentStep }} of {{ totalSteps }}
                </div>
                <div class="bg-muted h-2 w-32 rounded-full">
                  <div
                    class="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                  />
                </div>
                <div class="text-muted-foreground text-sm">
                  {{ Math.round((currentStep / totalSteps) * 100) }}%
                </div>
              </div>

              <!-- Next Button -->
              <Button
                v-if="currentStep < totalSteps"
                variant="primary"
                size="sm"
                @click="nextStep"
                :disabled="!canProceedToNext"
              >
                Next
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </Button>
              <Button
                v-else
                variant="primary"
                size="sm"
                @click="saveSettings"
                :disabled="isSaving"
                :loading="isSaving"
              >
                <SaveIcon class="mr-2 h-4 w-4" />
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <form @submit.prevent="saveSettings" class="space-y-8">
            <!-- Step 1: Account Information -->
            <div v-if="currentStep === 1" class="space-y-8">
              <div class="mb-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
                >
                  <Icon name="mdi:account" class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-foreground mb-2 text-2xl font-bold">Account Information</h2>
                <p class="text-muted-foreground">
                  Set up your company details and contact information
                </p>
              </div>

              <div class="bg-card border-border rounded-lg border p-8">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div class="lg:col-span-2">
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Company Name *
                    </label>
                    <input
                      v-model="settings.companyName"
                      type="text"
                      required
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Contact Name *
                    </label>
                    <input
                      v-model="settings.contactName"
                      type="text"
                      required
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Email Address *
                    </label>
                    <input
                      v-model="settings.email"
                      type="email"
                      required
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      v-model="settings.phone"
                      type="tel"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium"> Website </label>
                    <input
                      v-model="settings.website"
                      type="url"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Location *
                    </label>
                    <input
                      v-model="settings.location"
                      type="text"
                      required
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Timezone *
                    </label>
                    <SelectInput
                      v-model="settings.timezone"
                      :options="timezoneOptions"
                      placeholder="Select timezone"
                      required
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Industry *
                    </label>
                    <input
                      v-model="settings.industry"
                      type="text"
                      required
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g., Technology, Advertising, Education"
                    />
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Company Size *
                    </label>
                    <SelectInput
                      v-model="settings.companySize"
                      :options="companySizeOptions"
                      placeholder="Select company size"
                      required
                    />
                  </div>

                  <div class="lg:col-span-2">
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Company Description
                    </label>
                    <textarea
                      v-model="settings.description"
                      rows="3"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="Brief description of your company and what you do..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Job Defaults -->
            <div v-if="currentStep === 2" class="space-y-8">
              <div class="mb-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600"
                >
                  <Icon name="mdi:target" class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-foreground mb-2 text-2xl font-bold">Job Defaults</h2>
                <p class="text-muted-foreground">Set your default preferences for job postings</p>
              </div>

              <div class="bg-card border-border rounded-lg border p-8">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Default Budget Range
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          v-model.number="settings.preferences.defaultBudget.min"
                          type="number"
                          min="0"
                          class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          placeholder="Min"
                        />
                      </div>
                      <div>
                        <input
                          v-model.number="settings.preferences.defaultBudget.max"
                          type="number"
                          min="0"
                          class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Default Currency
                    </label>
                    <SelectInput
                      v-model="settings.preferences.defaultBudget.currency"
                      :options="currencyOptions"
                      placeholder="Select currency"
                    />
                  </div>

                  <div class="lg:col-span-2">
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Preferred Languages
                    </label>
                    <SelectInput
                      v-model="settings.preferences.preferredLanguages"
                      :options="languageOptions"
                      placeholder="Select preferred languages"
                      multiple
                    />
                  </div>

                  <div class="lg:col-span-2">
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Preferred Voice Types
                    </label>
                    <SelectInput
                      v-model="settings.preferences.preferredVoiceTypes"
                      :options="voiceTypeOptions"
                      placeholder="Select preferred voice types"
                      multiple
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Job Preferences -->
            <div v-if="currentStep === 3" class="space-y-8">
              <div class="mb-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600"
                >
                  <Icon name="mdi:cog" class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-foreground mb-2 text-2xl font-bold">Job Preferences</h2>
                <p class="text-muted-foreground">Configure your workflow and approval settings</p>
              </div>

              <div class="bg-card border-border rounded-lg border p-8">
                <div class="space-y-6">
                  <div
                    class="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 class="text-foreground text-sm font-medium">Auto-approve Applications</h3>
                      <p class="text-muted-foreground text-sm">
                        Automatically approve applications that meet your criteria
                      </p>
                    </div>
                    <input
                      v-model="settings.preferences.autoApprove"
                      type="checkbox"
                      class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                    />
                  </div>

                  <div
                    class="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 class="text-foreground text-sm font-medium">Require NDA</h3>
                      <p class="text-muted-foreground text-sm">
                        Require voice actors to sign an NDA before starting work
                      </p>
                    </div>
                    <input
                      v-model="settings.preferences.requireNDA"
                      type="checkbox"
                      class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                    />
                  </div>

                  <div
                    class="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 class="text-foreground text-sm font-medium">Require Portfolio</h3>
                      <p class="text-muted-foreground text-sm">
                        Only allow voice actors with portfolios to apply
                      </p>
                    </div>
                    <input
                      v-model="settings.preferences.requirePortfolio"
                      type="checkbox"
                      class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                    />
                  </div>

                  <div
                    class="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 class="text-foreground text-sm font-medium">Public Profile</h3>
                      <p class="text-muted-foreground text-sm">
                        Make your client profile visible to voice actors
                      </p>
                    </div>
                    <input
                      v-model="settings.isPublic"
                      type="checkbox"
                      class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Social Links -->
            <div v-if="currentStep === 4" class="space-y-8">
              <div class="mb-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600"
                >
                  <Icon name="mdi:share-variant" class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-foreground mb-2 text-2xl font-bold">Social Links</h2>
                <p class="text-muted-foreground">Connect your social media profiles</p>
              </div>

              <div class="bg-card border-border rounded-lg border p-8">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium"> LinkedIn </label>
                    <input
                      v-model="settings.socialLinks.linkedin"
                      type="url"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium">
                      Facebook Page
                    </label>
                    <input
                      v-model="settings.socialLinks.facebook"
                      type="url"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="https://facebook.com/yourcompany"
                    />
                  </div>
                  <div>
                    <label class="text-foreground mb-2 block text-sm font-medium"> Twitter </label>
                    <input
                      v-model="settings.socialLinks.twitter"
                      type="url"
                      class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="https://twitter.com/yourcompany"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Review & Save -->
            <div v-if="currentStep === 5" class="space-y-8">
              <div class="mb-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
                >
                  <Icon name="mdi:check-circle" class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-foreground mb-2 text-2xl font-bold">Review & Save</h2>
                <p class="text-muted-foreground">Review your settings and save your changes</p>
              </div>

              <div class="bg-card border-border rounded-lg border p-8">
                <div class="space-y-6">
                  <!-- Account Summary -->
                  <div class="border-border border-b pb-6">
                    <h3 class="text-foreground mb-4 text-lg font-semibold">Account Information</h3>
                    <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <span class="text-muted-foreground">Company:</span>
                        <span class="ml-2 font-medium">{{
                          settings.companyName || 'Not set'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Contact:</span>
                        <span class="ml-2 font-medium">{{
                          settings.contactName || 'Not set'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Email:</span>
                        <span class="ml-2 font-medium">{{ settings.email || 'Not set' }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Industry:</span>
                        <span class="ml-2 font-medium">{{ settings.industry || 'Not set' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Job Defaults Summary -->
                  <div class="border-border border-b pb-6">
                    <h3 class="text-foreground mb-4 text-lg font-semibold">Job Defaults</h3>
                    <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <span class="text-muted-foreground">Budget Range:</span>
                        <span class="ml-2 font-medium">
                          {{ settings.preferences.defaultBudget.min || 0 }} -
                          {{ settings.preferences.defaultBudget.max || 0 }}
                          {{ settings.preferences.defaultBudget.currency }}
                        </span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Languages:</span>
                        <span class="ml-2 font-medium"
                          >{{ settings.preferences.preferredLanguages.length }} selected</span
                        >
                      </div>
                      <div>
                        <span class="text-muted-foreground">Voice Types:</span>
                        <span class="ml-2 font-medium"
                          >{{ settings.preferences.preferredVoiceTypes.length }} selected</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Preferences Summary -->
                  <div class="border-border border-b pb-6">
                    <h3 class="text-foreground mb-4 text-lg font-semibold">Preferences</h3>
                    <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <span class="text-muted-foreground">Auto-approve:</span>
                        <span class="ml-2 font-medium">{{
                          settings.preferences.autoApprove ? 'Yes' : 'No'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Require NDA:</span>
                        <span class="ml-2 font-medium">{{
                          settings.preferences.requireNDA ? 'Yes' : 'No'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Require Portfolio:</span>
                        <span class="ml-2 font-medium">{{
                          settings.preferences.requirePortfolio ? 'Yes' : 'No'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Public Profile:</span>
                        <span class="ml-2 font-medium">{{ settings.isPublic ? 'Yes' : 'No' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Social Links Summary -->
                  <div>
                    <h3 class="text-foreground mb-4 text-lg font-semibold">Social Links</h3>
                    <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div>
                        <span class="text-muted-foreground">LinkedIn:</span>
                        <span class="ml-2 font-medium">{{
                          settings.socialLinks.linkedin ? 'Set' : 'Not set'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Facebook:</span>
                        <span class="ml-2 font-medium">{{
                          settings.socialLinks.facebook ? 'Set' : 'Not set'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-muted-foreground">Twitter:</span>
                        <span class="ml-2 font-medium">{{
                          settings.socialLinks.twitter ? 'Set' : 'Not set'
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceClient } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import Icon from '@/components/atoms/Icon.vue'
import ArrowRightIcon from '~icons/mdi/arrow-right'
import SaveIcon from '~icons/mdi/content-save'
import RefreshIcon from '~icons/mdi/refresh'

const router = useRouter()

// State
const isSaving = ref(false)
const currentStep = ref(1)
const totalSteps = ref(5)

// Settings form
const settings = reactive<VoiceClient>({
  id: '',
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  timezone: '',
  industry: '',
  companySize: '',
  description: '',
  logoUrl: '',
  isPublic: false,
  activeJobs: 0,
  completedJobs: 0,
  totalSpent: 0,
  averageRating: 0,
  joinedDate: '',
  lastActive: '',
  socialLinks: {
    website: '',
    linkedin: '',
    facebook: '',
    twitter: '',
  },
  preferences: {
    defaultBudget: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
    preferredLanguages: [],
    preferredVoiceTypes: [],
    autoApprove: false,
    requireNDA: false,
  },
})

// Options
const timezoneOptions = [
  { value: 'UTC-12', label: '(UTC-12:00) International Date Line West' },
  { value: 'UTC-11', label: '(UTC-11:00) Coordinated Universal Time-11' },
  { value: 'UTC+0', label: '(UTC+00:00) Coordinated Universal Time' },
  { value: 'UTC+1', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
  { value: 'UTC+2', label: '(UTC+02:00) Athens, Bucharest, Istanbul' },
  { value: 'UTC+3', label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd' },
  { value: 'UTC+4', label: '(UTC+04:00) Abu Dhabi, Muscat' },
  { value: 'UTC+5', label: '(UTC+05:00) Islamabad, Karachi, Tashkent' },
  { value: 'UTC+6', label: '(UTC+06:00) Almaty, Dhaka' },
  { value: 'UTC+7', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'UTC+8', label: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
  { value: 'UTC+9', label: '(UTC+09:00) Osaka, Sapporo, Tokyo' },
  { value: 'UTC+10', label: '(UTC+10:00) Brisbane, Canberra, Melbourne, Sydney' },
  { value: 'UTC+11', label: '(UTC+11:00) Magadan, Solomon Islands, New Caledonia' },
  { value: 'UTC+12', label: '(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka' },
]

const companySizeOptions = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-250 employees)' },
  { value: 'large', label: 'Large (251-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' },
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
  { value: 'Dutch', label: 'Dutch' },
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
  { value: 'e-learning', label: 'E-Learning' },
]

// Computed
const canGoBack = computed(() => currentStep.value > 1)

const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        settings.companyName &&
        settings.contactName &&
        settings.email &&
        settings.location &&
        settings.timezone &&
        settings.industry &&
        settings.companySize
      )
    case 2:
      return (
        settings.preferences.preferredLanguages.length > 0 &&
        settings.preferences.preferredVoiceTypes.length > 0
      )
    case 3:
    case 4:
      return true // Optional steps
    case 5:
      return true // Review step
    default:
      return false
  }
})

// Methods
const goBack = () => {
  router.back()
}

const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNext.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const loadSettings = () => {
  const client = mockClientData.voiceClients[0]

  // Load basic info
  settings.id = client.id
  settings.companyName = client.companyName
  settings.contactName = client.contactName
  settings.email = client.email
  settings.phone = client.phone || ''
  settings.website = client.website || ''
  settings.location = client.location
  settings.timezone = client.timezone || 'UTC+0'
  settings.industry = client.industry
  settings.companySize = client.companySize || 'small'
  settings.description = client.description || ''
  settings.logoUrl = client.logoUrl || ''
  settings.isPublic = client.isPublic

  // Load preferences
  settings.preferences.defaultBudget.min = client.preferences.defaultBudget.min
  settings.preferences.defaultBudget.max = client.preferences.defaultBudget.max
  settings.preferences.defaultBudget.currency = client.preferences.defaultBudget.currency
  settings.preferences.preferredLanguages = [...client.preferences.preferredLanguages]
  settings.preferences.preferredVoiceTypes = [...client.preferences.preferredVoiceTypes]
  settings.preferences.autoApprove = client.preferences.autoApprove
  settings.preferences.requireNDA = client.preferences.requireNDA

  // Load social links
  settings.socialLinks.linkedin = client.socialLinks.linkedin || ''
  settings.socialLinks.facebook = client.socialLinks.facebook || ''
  settings.socialLinks.twitter = client.socialLinks.twitter || ''
}

const saveSettings = async () => {
  isSaving.value = true

  try {
    // In real app, send settings to API
    console.log('Saving client settings:', settings)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success message
    alert('Settings saved successfully!')

    // Navigate back or to dashboard
    router.push('/client/dashboard')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  loadSettings()
  currentStep.value = 1
  alert('Settings reset to default values.')
}

onMounted(() => {
  loadSettings()
})
</script>
