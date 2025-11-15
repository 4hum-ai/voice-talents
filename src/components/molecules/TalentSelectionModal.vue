<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-background border-border max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border shadow-lg"
    >
      <!-- Header -->
      <div class="border-border flex items-center justify-between border-b p-6">
        <div>
          <h2 class="text-foreground text-xl font-semibold">Select Talent for Contract</h2>
          <p class="text-muted-foreground mt-1">{{ jobTitle }}</p>
        </div>
        <Button variant="ghost" size="sm" icon="mdi:close" @click="$emit('close')" />
      </div>

      <!-- Content (hide when showing agreement review) -->
      <div v-if="!showAgreementReview" class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
        <div v-if="applications.length === 0" class="py-12 text-center">
          <UserIcon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 class="text-foreground mb-2 text-lg font-medium">No Applications Yet</h3>
          <p class="text-muted-foreground">
            Applications will appear here as talents submit their proposals.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-muted-foreground text-sm"
              >{{ applications.length }} application{{
                applications.length !== 1 ? 's' : ''
              }}
              received</span
            >
            <div class="flex items-center space-x-2">
              <span class="text-muted-foreground text-sm">Sort by:</span>
              <SelectInput
                :model-value="sortBy"
                @update:model-value="sortBy = $event as string"
                :options="sortOptions"
                class="w-40"
              />
            </div>
          </div>

          <!-- Application Cards -->
          <div class="space-y-4">
            <div
              v-for="application in sortedApplications"
              :key="application.id"
              class="bg-card border-border hover:border-primary/20 group relative rounded-lg border p-6 transition-all duration-200"
              :class="{ 'border-primary bg-primary/5': selectedApplication?.id === application.id }"
            >
              <!-- Selection Indicator -->
              <div class="absolute top-4 right-4">
                <div
                  v-if="selectedApplication?.id === application.id"
                  class="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <CheckIcon class="h-4 w-4" />
                </div>
                <div
                  v-else
                  class="border-border hover:border-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border transition-colors"
                  @click="selectApplication(application)"
                >
                  <div class="h-3 w-3 rounded-full"></div>
                </div>
              </div>

              <!-- Talent Info -->
              <div class="mb-4 flex items-start space-x-4">
                <Avatar
                  :src="getTalentAvatar(application.voiceTalentId)"
                  :alt="application.voiceTalentName"
                  :seed="application.voiceTalentName"
                  size="lg"
                />
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-foreground text-lg font-semibold">
                      {{ application.voiceTalentName }}
                    </h3>
                    <StatusBadge
                      :status="application.status"
                      :variant="getStatusVariant(application.status)"
                    />
                  </div>
                  <p class="text-muted-foreground text-sm">
                    {{ getTalentLocation(application.voiceTalentId) }}
                  </p>
                  <div class="mt-2 flex items-center space-x-4 text-sm">
                    <div class="flex items-center space-x-1">
                      <StarIcon class="h-4 w-4 text-yellow-500" />
                      <span class="text-foreground font-medium">{{
                        getTalentRating(application.voiceTalentId)
                      }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <BriefcaseIcon class="h-4 w-4 text-blue-500" />
                      <span class="text-foreground">{{
                        getTalentExperience(application.voiceTalentId)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Proposal Details -->
              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="bg-muted/50 rounded-lg p-3">
                  <div class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Proposed Rate
                  </div>
                  <div class="text-foreground mt-1 text-lg font-semibold">
                    {{ formatCurrency(application.proposedRate, application.proposedCurrency) }}
                  </div>
                </div>
                <div class="bg-muted/50 rounded-lg p-3">
                  <div class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Timeline
                  </div>
                  <div class="text-foreground mt-1 font-medium">
                    {{ application.proposedTimeline }}
                  </div>
                </div>
                <div class="bg-muted/50 rounded-lg p-3">
                  <div class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Estimated Hours
                  </div>
                  <div class="text-foreground mt-1 font-medium">
                    {{ application.estimatedHours }}h
                  </div>
                </div>
              </div>

              <!-- Cover Letter -->
              <div class="mb-4">
                <h4 class="text-foreground mb-2 font-medium">Cover Letter</h4>
                <p class="text-muted-foreground text-sm leading-relaxed">
                  {{ application.coverLetter }}
                </p>
              </div>

              <!-- Experience -->
              <div class="mb-4">
                <h4 class="text-foreground mb-2 font-medium">Relevant Experience</h4>
                <p class="text-muted-foreground text-sm leading-relaxed">
                  {{ application.relevantExperience }}
                </p>
              </div>

              <!-- Custom Samples -->
              <div v-if="application.customSamples.length > 0" class="mb-4">
                <h4 class="text-foreground mb-2 font-medium">Custom Samples</h4>
                <div class="space-y-2">
                  <div
                    v-for="sample in application.customSamples"
                    :key="sample.id"
                    class="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                  >
                    <div>
                      <div class="text-foreground font-medium">{{ sample.title }}</div>
                      <div class="text-muted-foreground text-sm">{{ sample.description }}</div>
                    </div>
                    <Button variant="outline" size="sm" icon="mdi:play" @click="playSample(sample)"
                      >Play</Button
                    >
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between">
                <div class="text-muted-foreground text-xs">
                  Applied {{ formatDate(application.appliedDate) }}
                </div>
                <div class="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="mdi:account"
                    @click="viewTalentProfile()"
                    >View Profile</Button
                  >
                  <Button
                    variant="outline"
                    size="sm"
                    :icon="selectedApplication?.id === application.id ? 'mdi:check' : 'mdi:check'"
                    @click="selectApplication(application)"
                    :class="{
                      'bg-primary text-primary-foreground':
                        selectedApplication?.id === application.id,
                    }"
                    >{{
                      selectedApplication?.id === application.id ? 'Selected' : 'Select'
                    }}</Button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agreement Review Step -->
      <div v-if="showAgreementReview" class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
        <AgreementReviewStep
          :agreement-type="agreementType"
          :agreement-data="agreementData"
          :accepted="agreementAccepted"
          @update:accepted="agreementAccepted = $event"
          @approve="finalizeApproval"
          @cancel="showAgreementReview = false"
        />
      </div>

      <!-- Footer (only show if not in agreement review) -->
      <div
        v-if="!showAgreementReview"
        class="border-border flex items-center justify-between border-t p-6"
      >
        <div class="text-muted-foreground text-sm">
          <span v-if="selectedApplication">
            Selected:
            <span class="text-foreground font-medium">{{
              selectedApplication.voiceTalentName
            }}</span>
          </span>
          <span v-else>No talent selected</span>
        </div>
        <div class="flex space-x-3">
          <Button variant="outline" @click="$emit('close')"> Cancel </Button>
          <Button
            variant="primary"
            :disabled="!selectedApplication"
            icon="mdi:check"
            @click="startApprovalProcess"
            >Approve & Award Contract</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import { SelectInput } from '@/lib/form'
import AgreementReviewStep from '@/components/molecules/AgreementReviewStep.vue'
import { useToast } from '@/lib/toast'
import { mockVoiceTalents } from '@/data/mock-voice-talent-data'
import type { JobApplication } from '@/types/voice-client'
// Close icon removed; using Button icon prop instead
// User icon removed; using Button icon prop instead
import CheckIcon from '~icons/mdi/check'
import StarIcon from '~icons/mdi/star'
import BriefcaseIcon from '~icons/mdi/briefcase'
// Play icon removed; using Button icon prop instead

interface Props {
  open: boolean
  jobTitle: string
  applications: JobApplication[]
}

interface Emits {
  (e: 'close'): void
  (e: 'approve', application: JobApplication): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { addToast: showToast } = useToast()

// State
const selectedApplication = ref<JobApplication | null>(null)
const sortBy = ref('appliedDate')
const showAgreementReview = ref(false)
const agreementAccepted = ref(false)

// Sort options
const sortOptions = [
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'proposedRate', label: 'Rate (Low to High)' },
  { value: 'proposedRateDesc', label: 'Rate (High to Low)' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'rating', label: 'Rating' },
]

// Computed
const sortedApplications = computed(() => {
  const apps = [...props.applications]

  switch (sortBy.value) {
    case 'proposedRate':
      return apps.sort((a, b) => a.proposedRate - b.proposedRate)
    case 'proposedRateDesc':
      return apps.sort((a, b) => b.proposedRate - a.proposedRate)
    case 'timeline':
      return apps.sort((a, b) => {
        const aDays = parseInt(a.proposedTimeline) || 0
        const bDays = parseInt(b.proposedTimeline) || 0
        return aDays - bDays
      })
    case 'rating':
      return apps.sort((a, b) => {
        const aRating = getTalentRating(a.voiceTalentId)
        const bRating = getTalentRating(b.voiceTalentId)
        return bRating - aRating
      })
    case 'appliedDate':
    default:
      return apps.sort(
        (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime(),
      )
  }
})

// Methods
const selectApplication = (application: JobApplication) => {
  selectedApplication.value = application
}

// Determine agreement type based on job (this would come from job data in real app)
// For now, assume service agreement (talent_only) unless specified
const agreementType = computed<'service' | 'royalty'>(() => {
  // In real app, check job.voiceType
  // ai_synthesis = royalty, talent_only/hybrid = service
  return 'service' // Default to service agreement
})

// Prepare agreement data for review
const agreementData = computed(() => {
  if (!selectedApplication.value) {
    return {
      projectTitle: props.jobTitle,
      clientName: 'Your Company', // In real app, get from auth/store
      talentName: '',
      amount: 0,
      currency: 'USD',
      timeline: '',
      revisionRounds: undefined, // Would come from job requirements
    }
  }
  const app = selectedApplication.value
  return {
    projectTitle: props.jobTitle,
    clientName: 'Your Company', // In real app, get from auth/store
    talentName: app.voiceTalentName || '',
    amount: app.proposedRate || 0,
    currency: app.proposedCurrency || 'USD',
    timeline: app.proposedTimeline || '',
    revisionRounds: undefined, // Would come from job requirements
  }
})

const startApprovalProcess = () => {
  if (!selectedApplication.value) return

  // Show agreement review step
  showAgreementReview.value = true
  agreementAccepted.value = false
}

const finalizeApproval = () => {
  if (!selectedApplication.value || !agreementAccepted.value) return

  emit('approve', selectedApplication.value)
  showToast({
    type: 'success',
    title: 'Talent Approved',
    message: `Contract awarded to ${selectedApplication.value.voiceTalentName}`,
  })

  // Close modal
  showAgreementReview.value = false
  emit('close')
}

// Legacy method for backward compatibility - removed as unused

const viewTalentProfile = () => {
  // In a real app, this would navigate to talent profile
  showToast({
    type: 'info',
    title: 'View Profile',
    message: 'Talent profile view would open here',
  })
}

const playSample = (sample: { title: string }) => {
  // In a real app, this would play the audio sample
  showToast({
    type: 'info',
    title: 'Playing Sample',
    message: `Playing: ${sample.title}`,
  })
}

// Helper functions
const getTalentAvatar = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.avatarUrl || ''
}

const getTalentLocation = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.location || 'Location not specified'
}

const getTalentRating = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.averageRating || 0
}

const getTalentExperience = (talentId: string) => {
  const talent = mockVoiceTalents.find((va) => va.id === talentId)
  return talent?.experience || 'Unknown'
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'selected':
      return 'success'
    case 'shortlisted':
      return 'warning'
    case 'under_review':
      return 'info'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  const symbol = symbols[currency] || '$'
  return `${symbol}${amount.toLocaleString()}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>
