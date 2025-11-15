<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Step 4: Review & Payment</h1>
      <p class="text-muted-foreground text-lg">Review your project details and complete payment</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Left Column: Pricing & Payment (First on mobile for CTA visibility) -->
      <div class="space-y-6">
        <!-- Combined Pricing Breakdown & Secure Payment -->
        <div class="bg-card border-border rounded-lg border p-6">
          <h3 class="text-foreground mb-6 text-lg font-semibold">Pricing & Payment</h3>

          <div class="space-y-6">
            <!-- Pricing Breakdown -->
            <div>
              <h4 class="text-foreground mb-4 text-base font-medium">Pricing Breakdown</h4>
              <div class="space-y-3">
                <!-- Platform Service Fee -->
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Platform Fee:</span>
                  <span class="font-medium">${{ platformFee }}</span>
                </div>

                <!-- TTS Fees (for AI options) -->
                <div
                  v-if="voiceType === 'ai_synthesis' || voiceType === 'hybrid_approach'"
                  class="flex justify-between"
                >
                  <span class="text-muted-foreground">TTS Processing:</span>
                  <span class="font-medium">${{ ttsFees }}</span>
                </div>

                <!-- Professional Actor Fees (for talent options) -->
                <div
                  v-if="voiceType === 'talent_only' || voiceType === 'hybrid_approach'"
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
                  <div class="text-muted-foreground mb-2 text-sm font-medium">
                    Premium Features:
                  </div>
                  <div
                    v-for="featureDetail in enabledPremiumFeatures"
                    :key="featureDetail?.id"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-muted-foreground">{{ featureDetail?.label }}:</span>
                    <span class="font-medium">${{ featureDetail?.price }}</span>
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

            <!-- Divider -->
            <div class="border-border border-t"></div>

            <!-- Secure Payment -->
            <div>
              <h4 class="text-foreground mb-4 text-base font-medium">Secure Payment</h4>
              <div class="space-y-4">
                <!-- Payment Button - Redirects to Stripe Hosted Checkout -->
                <Button
                  variant="primary"
                  size="lg"
                  class="w-full"
                  :disabled="isLoadingPayment || props.isSubmitting"
                  @click="handleStripePayment"
                >
                  <Icon
                    v-if="isLoadingPayment || props.isSubmitting"
                    name="mdi:loading"
                    class="mr-2 h-5 w-5 animate-spin"
                  />
                  <Icon v-else name="mdi:credit-card" class="mr-2 h-5 w-5" />
                  {{
                    isLoadingPayment
                      ? 'Processing...'
                      : props.isSubmitting
                        ? 'Redirecting...'
                        : `Pay $${totalCost}`
                  }}
                </Button>

                <!-- Payment Info -->
                <div
                  class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
                >
                  <div class="flex items-start space-x-2">
                    <IconMdiInformation
                      class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    />
                    <div class="text-sm">
                      <p class="mb-1 font-medium text-blue-800 dark:text-blue-200">
                        Secure Payment:
                      </p>
                      <ul class="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                        <li>• Payment is processed securely through Stripe</li>
                        <li>• Your job will be published immediately after payment</li>
                        <li>• All major credit cards and payment methods accepted</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div
                  v-if="paymentError"
                  class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20"
                >
                  <div class="flex items-start space-x-2">
                    <Icon
                      name="mdi:alert-circle"
                      class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                    />
                    <div class="text-sm">
                      <p class="font-medium text-red-800 dark:text-red-200">Payment Error</p>
                      <p class="mt-1 text-xs text-red-700 dark:text-red-300">{{ paymentError }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Project Details & Information -->
      <div class="space-y-6">
        <div class="bg-card border-border rounded-lg border p-6">
          <!-- Project Overview -->
          <div class="mb-6">
            <h3 class="text-foreground mb-4 text-lg font-semibold">Project Overview</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Title:</span>
                <span class="font-medium">{{ jobForm.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Type:</span>
                <span class="font-medium">{{ getJobTypeLabel(jobForm.voiceType) }}</span>
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

          <!-- Divider -->
          <div class="border-border my-6 border-t"></div>

          <!-- Requirements -->
          <div class="mb-6">
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

          <!-- Files (if any) -->
          <div v-if="hasFiles" class="mb-6">
            <div class="border-border border-t pt-6">
              <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>
              <div class="space-y-2">
                <div v-if="jobForm.files.script" class="flex items-center space-x-2">
                  <IconMdiFileDocument class="h-4 w-4" />
                  <span class="text-sm">{{ jobForm.files.script.name }}</span>
                </div>
                <div v-if="jobForm.files.referenceAudio" class="flex items-center space-x-2">
                  <IconMdiFileMusic class="h-4 w-4" />
                  <span class="text-sm">{{ jobForm.files.referenceAudio.name }}</span>
                </div>
                <div
                  v-if="jobForm.files.additional && jobForm.files.additional.length > 0"
                  class="flex items-center space-x-2"
                >
                  <IconMdiFileMultiple class="h-4 w-4" />
                  <span class="text-sm"
                    >{{ jobForm.files.additional.length }} additional files</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-border my-6 border-t"></div>

          <!-- Job ID -->
          <div class="mb-6">
            <h3 class="text-foreground mb-4 text-lg font-semibold">Job Reference</h3>
            <div class="bg-muted/30 flex items-center justify-between rounded-lg p-3">
              <span class="text-muted-foreground text-sm">Job ID:</span>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-sm font-medium">{{ jobId }}</span>
                <button
                  @click="copyToClipboard(jobId)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Copy Job ID"
                >
                  <IconMdiContentCopy class="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              type="button"
              class="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm underline"
              @click="openContentViewer"
            >
              <Icon name="mdi:file-document" class="h-4 w-4" />
              View Agreement Template Reference
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Viewer -->
    <ContentViewer
      :open="contentViewerOpen"
      :slug="currentContentSlug"
      @update:open="contentViewerOpen = $event"
      @close="contentViewerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/atoms/Icon.vue'
import Button from '@/components/atoms/Button.vue'
import { useToast } from '@/lib/toast'
import { useStripePayment, type StripeLineItem } from '@/composables/useStripePayment'
import { getPremiumFeatureById } from '@/composables/usePremiumFeatures'
import { ContentViewer } from '@/lib/content'
import IconMdiContentCopy from '~icons/mdi/content-copy'
import IconMdiFileDocument from '~icons/mdi/file-document'
import IconMdiFileMusic from '~icons/mdi/file-music'
import IconMdiFileMultiple from '~icons/mdi/file-multiple'
import IconMdiInformation from '~icons/mdi/information'

interface JobForm {
  voiceType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
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
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'payment-initiated', sessionId: string): void
  (e: 'payment-confirmed'): void
}>()

const { success, error } = useToast()
const { createCheckoutSession, isLoading: isLoadingPayment } = useStripePayment()

const paymentError = ref<string | null>(null)

// Generate a unique job ID for payment reference
const jobId = computed(() => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `VA-${timestamp}-${random}`.toUpperCase()
})

// Copy to clipboard functionality
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    success('Text copied to clipboard', 'Copied!')
  } catch {
    error('Could not copy to clipboard', 'Copy Failed')
  }
}

// Pricing calculations
const platformFee = computed(() => {
  switch (props.voiceType) {
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
  if (props.voiceType === 'ai_synthesis' || props.voiceType === 'hybrid_approach') {
    return 15 // Base TTS processing fee
  }
  return 0
})

const actorFees = computed(() => {
  if (props.voiceType === 'talent_only' || props.voiceType === 'hybrid_approach') {
    return 100 // Base professional actor fee
  }
  return 0
})

const revisionFees = computed(() => {
  const rounds = parseInt(props.jobForm.requirements.revisionRounds) || 0
  return rounds * 10 // $10 per revision
})

// Get enabled premium features with details (including stripePriceId)
const enabledPremiumFeatures = computed(() => {
  const features: ReturnType<typeof getPremiumFeatureById>[] = []

  if (props.jobForm.premiumFeatures.talentOutreach) {
    const feature = getPremiumFeatureById('talentOutreach')
    if (feature) features.push(feature)
  }
  if (props.jobForm.premiumFeatures.aiMatching) {
    const feature = getPremiumFeatureById('aiMatching')
    if (feature) features.push(feature)
  }
  if (props.jobForm.premiumFeatures.autoPrompts) {
    const feature = getPremiumFeatureById('autoPrompts')
    if (feature) features.push(feature)
  }

  return features
})

const premiumFees = computed(() => {
  return enabledPremiumFeatures.value.reduce((sum, feature) => sum + (feature?.price || 0), 0)
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

// const getSelectionTypeLabel = (type: string) => {
//   const labels: Record<string, string> = {
//     listing: 'Public Listing',
//     pick_own: 'Pick Your Own',
//     private_invite: 'Private Invite',
//   }
//   return labels[type] || type
// }

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

// Content viewer state
const contentViewerOpen = ref(false)

// Determine agreement template slug based on voice type
const currentContentSlug = computed(() => {
  // talent_only = Service Agreement
  // ai_synthesis = Royalty Agreement
  // hybrid_approach = Both (show Service as primary)
  if (props.voiceType === 'ai_synthesis') {
    return 'agreement-template-royalty'
  }
  // Default to service agreement for talent_only and hybrid
  return 'agreement-template-service'
})

const openContentViewer = () => {
  contentViewerOpen.value = true
}

// Build line items for Stripe checkout
const buildLineItems = computed((): StripeLineItem[] => {
  const items: StripeLineItem[] = []

  // Platform Fee
  if (platformFee.value > 0) {
    items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Platform Fee',
          description: `Platform service fee for ${getJobTypeLabel(props.voiceType || 'talent_only')}`,
        },
        unit_amount: Math.round(platformFee.value * 100),
      },
      quantity: 1,
    })
  }

  // TTS Processing Fee
  if (ttsFees.value > 0) {
    items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'TTS Processing',
          description: 'AI voice synthesis processing fee',
        },
        unit_amount: Math.round(ttsFees.value * 100),
      },
      quantity: 1,
    })
  }

  // Professional Actor Fee
  if (actorFees.value > 0) {
    items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Professional Actor',
          description: 'Professional voice talent fee',
        },
        unit_amount: Math.round(actorFees.value * 100),
      },
      quantity: 1,
    })
  }

  // Revision Fees
  if (revisionFees.value > 0) {
    items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Revisions',
          description: `${props.jobForm.requirements.revisionRounds} revision round(s)`,
        },
        unit_amount: Math.round(revisionFees.value * 100),
      },
      quantity: 1,
    })
  }

  // Premium Features - use Stripe Price ID if available, otherwise use price_data
  enabledPremiumFeatures.value.forEach((feature) => {
    if (!feature) return

    if (feature.stripePriceId) {
      // Use Stripe Price ID (preferred)
      items.push({
        price: feature.stripePriceId,
        quantity: 1,
      })
    } else {
      // Fallback to price_data
      items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: feature.label,
            description: feature.description,
          },
          unit_amount: Math.round(feature.price * 100),
        },
        quantity: 1,
      })
    }
  })

  return items
})

// Handle Stripe payment - redirects to Stripe hosted checkout
const handleStripePayment = async () => {
  paymentError.value = null

  try {
    // Build return URL for hosted checkout
    const currentPath = window.location.pathname || '/client/jobs'
    const successUrl = `${window.location.origin}${currentPath}?modal=createJob&step=4&payment=success&session_id={CHECKOUT_SESSION_ID}`

    const session = await createCheckoutSession({
      line_items: buildLineItems.value,
      mode: 'payment',
      return_url: successUrl, // Used for success_url
      jobId: jobId.value,
      metadata: {
        voiceType: props.voiceType || 'talent_only',
        projectType: props.jobForm.projectType,
        jobTitle: props.jobForm.title,
      },
    })

    // Emit event to parent component
    emit('payment-initiated', session.id)

    // For hosted checkout, we always get a URL to redirect to
    if (session.url) {
      // Redirect to Stripe hosted checkout page
      window.location.href = session.url
    } else {
      throw new Error('No checkout URL available. Please try again.')
    }
  } catch (err) {
    paymentError.value = err instanceof Error ? err.message : 'Failed to initiate payment'
    error(paymentError.value)
  }
}
</script>
