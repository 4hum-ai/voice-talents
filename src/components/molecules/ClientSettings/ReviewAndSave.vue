<template>
  <div class="space-y-8">
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
                modelValue.companyName || 'Not set'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Contact:</span>
              <span class="ml-2 font-medium">{{
                modelValue.contactName || 'Not set'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Email:</span>
              <span class="ml-2 font-medium">{{ modelValue.email || 'Not set' }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Industry:</span>
              <span class="ml-2 font-medium">{{ modelValue.industry || 'Not set' }}</span>
            </div>
            <div v-if="modelValue.phone">
              <span class="text-muted-foreground">Phone:</span>
              <span class="ml-2 font-medium">{{ modelValue.phone }}</span>
            </div>
            <div v-if="modelValue.website">
              <span class="text-muted-foreground">Website:</span>
              <span class="ml-2 font-medium">{{ modelValue.website }}</span>
            </div>
            <div v-if="modelValue.location">
              <span class="text-muted-foreground">Location:</span>
              <span class="ml-2 font-medium">{{ modelValue.location }}</span>
            </div>
            <div v-if="modelValue.companySize">
              <span class="text-muted-foreground">Company Size:</span>
              <span class="ml-2 font-medium">{{ getCompanySizeLabel(modelValue.companySize) }}</span>
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
                {{ modelValue.preferences.defaultBudget.min || 0 }} -
                {{ modelValue.preferences.defaultBudget.max || 0 }}
                {{ modelValue.preferences.defaultBudget.currency }}
              </span>
            </div>
            <div>
              <span class="text-muted-foreground">Languages:</span>
              <span class="ml-2 font-medium"
                >{{ modelValue.preferences.preferredLanguages.length }} selected</span
              >
            </div>
            <div>
              <span class="text-muted-foreground">Voice Types:</span>
              <span class="ml-2 font-medium"
                >{{ modelValue.preferences.preferredVoiceTypes.length }} selected</span
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
                modelValue.preferences.autoApprove ? 'Yes' : 'No'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Require NDA:</span>
              <span class="ml-2 font-medium">{{
                modelValue.preferences.requireNDA ? 'Yes' : 'No'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Require Portfolio:</span>
              <span class="ml-2 font-medium">{{
                modelValue.preferences.requirePortfolio ? 'Yes' : 'No'
              }}</span>
            </div>
            <div v-if="showPublicProfile">
              <span class="text-muted-foreground">Public Profile:</span>
              <span class="ml-2 font-medium">{{ modelValue.isPublic ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>

        <!-- Social Links Summary -->
        <div v-if="showSocialLinks">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Social Links</h3>
          <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <span class="text-muted-foreground">LinkedIn:</span>
              <span class="ml-2 font-medium">{{
                modelValue.socialLinks.linkedin ? 'Set' : 'Not set'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Facebook:</span>
              <span class="ml-2 font-medium">{{
                modelValue.socialLinks.facebook ? 'Set' : 'Not set'
              }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Twitter:</span>
              <span class="ml-2 font-medium">{{
                modelValue.socialLinks.twitter ? 'Set' : 'Not set'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'

interface BudgetRange {
  min: number
  max: number
  currency: string
}

interface Preferences {
  defaultBudget: BudgetRange
  preferredLanguages: string[]
  preferredVoiceTypes: string[]
  autoApprove: boolean
  requireNDA: boolean
  requirePortfolio: boolean
}

interface SocialLinks {
  website: string
  linkedin: string
  facebook: string
  twitter: string
}

interface ReviewData {
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  location?: string
  industry?: string
  companySize?: string
  preferences: Preferences
  isPublic?: boolean
  socialLinks: SocialLinks
}

interface Props {
  modelValue: ReviewData
  showPublicProfile?: boolean
  showSocialLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPublicProfile: true,
  showSocialLinks: true
})

// Company size options for label lookup
const companySizeOptions = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-250 employees)' },
  { value: 'large', label: 'Large (251-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
]

// Methods
const getCompanySizeLabel = (value: string) => {
  const option = companySizeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>
