<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Step 4: Review & Payment</h1>
      <p class="text-muted-foreground text-lg">Review your project details and complete payment</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Left Column: Project Review -->
      <div class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Project Overview</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Title:</span>
              <span class="font-medium">{{ jobForm.title }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Type:</span>
              <span class="font-medium">{{ getJobTypeLabel(jobForm.voiceSolution) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Project Type:</span>
              <span class="font-medium">{{ jobForm.projectType }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Deadline:</span>
              <span class="font-medium">{{ formatDate(jobForm.deadline) }}</span>
            </div>
          </div>
        </div>

        <!-- Requirements -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Requirements</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Voice Type:</span>
              <span class="font-medium">{{ jobForm.requirements.voiceType }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Language:</span>
              <span class="font-medium">{{ jobForm.requirements.language }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Gender:</span>
              <span class="font-medium">{{ jobForm.requirements.gender }}</span>
            </div>
            <div v-if="jobForm.requirements.deliveryFormat" class="flex justify-between">
              <span class="text-muted-foreground">Delivery Format:</span>
              <span class="font-medium">{{ jobForm.requirements.deliveryFormat }}</span>
            </div>
            <div v-if="jobForm.requirements.revisionRounds" class="flex justify-between">
              <span class="text-muted-foreground">Revisions:</span>
              <span class="font-medium">{{ jobForm.requirements.revisionRounds }}</span>
            </div>
          </div>
        </div>

        <!-- Talent Selection -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Talent Selection</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Method:</span>
              <span class="font-medium">{{
                getSelectionTypeLabel(jobForm.talentOptions.selectionType)
              }}</span>
            </div>
            <div
              v-if="jobForm.talentOptions.selectedTalents.length > 0"
              class="flex justify-between"
            >
              <span class="text-muted-foreground">Selected Talent:</span>
              <span class="font-medium"
                >{{ jobForm.talentOptions.selectedTalents.length }} talent(s)</span
              >
            </div>
          </div>
        </div>

        <!-- Files -->
        <div v-if="hasFiles" class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>
          <div class="space-y-2">
            <div v-if="jobForm.files.script" class="flex items-center space-x-2">
              <Icon name="mdi:file-document" class="text-muted-foreground h-4 w-4" />
              <span class="text-sm">{{ jobForm.files.script.name }}</span>
            </div>
            <div v-if="jobForm.files.referenceAudio" class="flex items-center space-x-2">
              <Icon name="mdi:file-music" class="text-muted-foreground h-4 w-4" />
              <span class="text-sm">{{ jobForm.files.referenceAudio.name }}</span>
            </div>
            <div
              v-if="jobForm.files.additional && jobForm.files.additional.length > 0"
              class="flex items-center space-x-2"
            >
              <Icon name="mdi:file-multiple" class="text-muted-foreground h-4 w-4" />
              <span class="text-sm">{{ jobForm.files.additional.length }} additional files</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Payment & Pricing -->
      <div class="space-y-6">
        <!-- Pricing Breakdown -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Pricing Breakdown</h3>

          <div class="space-y-3">
            <!-- Platform Service Fee -->
            <div class="flex justify-between">
              <span class="text-muted-foreground">Platform Fee:</span>
              <span class="font-medium">${{ platformFee }}</span>
            </div>

            <!-- TTS Fees (for AI options) -->
            <div
              v-if="voiceSolution === 'ai_synthesis' || voiceSolution === 'hybrid_approach'"
              class="flex justify-between"
            >
              <span class="text-muted-foreground">TTS Processing:</span>
              <span class="font-medium">${{ ttsFees }}</span>
            </div>

            <!-- Professional Actor Fees (for talent options) -->
            <div
              v-if="voiceSolution === 'talent_only' || voiceSolution === 'hybrid_approach'"
              class="flex justify-between"
            >
              <span class="text-muted-foreground">Professional Actor:</span>
              <span class="font-medium">${{ actorFees }}</span>
            </div>

            <!-- Revision Fees -->
            <div v-if="revisionFees > 0" class="flex justify-between">
              <span class="text-muted-foreground"
                >Revisions ({{ jobForm.requirements.revisionRounds }}):</span
              >
              <span class="font-medium">${{ revisionFees }}</span>
            </div>

            <!-- Premium Features -->
            <div v-if="premiumFees > 0" class="border-border border-t pt-3">
              <div class="text-muted-foreground mb-2 text-sm font-medium">Premium Features:</div>
              <div
                v-if="jobForm.premiumFeatures.talentOutreach"
                class="flex justify-between text-sm"
              >
                <span class="text-muted-foreground">Talent Outreach:</span>
                <span class="font-medium">$25</span>
              </div>
              <div v-if="jobForm.premiumFeatures.aiMatching" class="flex justify-between text-sm">
                <span class="text-muted-foreground">AI Matching:</span>
                <span class="font-medium">$15</span>
              </div>
              <div v-if="jobForm.premiumFeatures.autoPrompts" class="flex justify-between text-sm">
                <span class="text-muted-foreground">Auto Prompts:</span>
                <span class="font-medium">$10</span>
              </div>
            </div>

            <!-- Total -->
            <div class="border-border border-t pt-3">
              <div class="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span class="text-primary">${{ totalCost }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-4 text-lg font-semibold">Payment Method</h3>

          <div class="space-y-3">
            <label
              class="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors"
            >
              <input
                v-model="paymentMethod"
                type="radio"
                value="direct"
                class="text-primary focus:ring-primary border-border h-4 w-4"
              />
              <div>
                <span class="text-foreground block text-sm font-medium">Direct Payment</span>
                <span class="text-muted-foreground block text-xs"
                  >Pay talent directly upon completion</span
                >
              </div>
            </label>

            <label
              class="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors"
            >
              <input
                v-model="paymentMethod"
                type="radio"
                value="escrow"
                class="text-primary focus:ring-primary border-border h-4 w-4"
              />
              <div>
                <span class="text-foreground block text-sm font-medium">Escrow Payment</span>
                <span class="text-muted-foreground block text-xs"
                  >Secure payments held until project completion</span
                >
              </div>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <Button
            variant="primary"
            size="lg"
            @click="emit('publish')"
            :disabled="isSubmitting"
            class="w-full"
          >
            <Icon v-if="isSubmitting" name="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="mdi:rocket-launch" class="mr-2 h-4 w-4" />
            {{ isSubmitting ? 'Publishing...' : `Publish Job - $${totalCost}` }}
          </Button>

          <Button variant="outline" size="lg" @click="emit('save-draft')" class="w-full">
            <Icon name="mdi:content-save" class="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="emit('previous')">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface JobForm {
  voiceSolution: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  title: string
  description: string
  projectType: string
  deadline: string
  requirements: {
    language: string
    voiceType: string
    gender: 'male' | 'female' | 'non-binary' | 'any'
    specialInstructions: string
    deliveryFormat: string
    deliveryTimeline: string
    revisionRounds: string
  }
  files: {
    script?: File
    referenceAudio?: File
    additional?: File[]
  }
  premiumFeatures: {
    talentOutreach: boolean
    aiMatching: boolean
    autoPrompts: boolean
  }
  talentOptions: {
    selectionType: 'listing' | 'pick_own' | 'private_invite'
    selectedTalents: string[]
    invitedTalents: string[]
  }
  aiSettings: {
    voiceModel: string
    voiceStyle: string
    emotion: string
    speed: 'slow' | 'normal' | 'fast'
    pitch: 'low' | 'normal' | 'high'
  }
}

interface Props {
  jobForm: JobForm
  voiceSolution?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  isSubmitting: boolean
}

interface Emits {
  (e: 'publish'): void
  (e: 'previous'): void
  (e: 'save-draft'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const paymentMethod = ref<'direct' | 'escrow'>('escrow')

// Pricing calculations
const platformFee = computed(() => {
  switch (props.voiceSolution) {
    case 'talent_only':
      return 50
    case 'ai_synthesis':
      return 25
    case 'hybrid_approach':
      return 35
    default:
      return 50
  }
})

const ttsFees = computed(() => {
  if (props.voiceSolution === 'ai_synthesis' || props.voiceSolution === 'hybrid_approach') {
    return 15 // Base TTS processing fee
  }
  return 0
})

const actorFees = computed(() => {
  if (props.voiceSolution === 'talent_only' || props.voiceSolution === 'hybrid_approach') {
    return 100 // Base professional actor fee
  }
  return 0
})

const revisionFees = computed(() => {
  const rounds = parseInt(props.jobForm.requirements.revisionRounds) || 0
  return rounds * 10 // $10 per revision
})

const premiumFees = computed(() => {
  let fees = 0
  if (props.jobForm.premiumFeatures.talentOutreach) fees += 25
  if (props.jobForm.premiumFeatures.aiMatching) fees += 15
  if (props.jobForm.premiumFeatures.autoPrompts) fees += 10
  return fees
})

const totalCost = computed(() => {
  return (
    platformFee.value + ttsFees.value + actorFees.value + revisionFees.value + premiumFees.value
  )
})


// Helper functions
const getJobTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    talent_only: 'Talent Only',
    ai_synthesis: 'AI Voice Synthesis',
    hybrid_approach: 'Hybrid Approach',
  }
  return labels[type] || type
}


const getSelectionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    listing: 'Public Listing',
    pick_own: 'Pick Your Own',
    private_invite: 'Private Invite',
  }
  return labels[type] || type
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}


const hasFiles = computed(() => {
  return (
    props.jobForm.files.script ||
    props.jobForm.files.referenceAudio ||
    (props.jobForm.files.additional && props.jobForm.files.additional.length > 0)
  )
})
</script>
