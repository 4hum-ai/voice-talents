<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-foreground mb-2 text-2xl font-bold">Payment Method</h2>
      <p class="text-muted-foreground">Choose how you'd like to handle payments for this job</p>
    </div>

    <div class="space-y-6">
      <!-- Payment Method Options -->
      <div class="space-y-4">
        <div v-for="method in paymentMethods" :key="method.value" class="relative">
          <input
            :id="method.value"
            v-model="localPaymentMethod"
            type="radio"
            :value="method.value"
            class="sr-only"
          />
          <label
            :for="method.value"
            class="flex cursor-pointer items-start rounded-lg border-2 p-6 transition-all hover:shadow-md"
            :class="
              localPaymentMethod === method.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            "
          >
            <div class="flex-1">
              <div class="mb-3 flex items-center space-x-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg"
                  :class="method.value === 'direct' ? 'bg-green-500/10' : 'bg-blue-500/10'"
                >
                  <Icon
                    :name="method.icon"
                    :class="
                      method.value === 'direct'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-blue-600 dark:text-blue-400'
                    "
                    class="h-5 w-5"
                  />
                </div>
                <div>
                  <h3 class="text-foreground font-semibold">{{ method.title }}</h3>
                  <p class="text-muted-foreground text-sm">{{ method.subtitle }}</p>
                </div>
              </div>

              <p class="text-muted-foreground mb-3 text-sm">{{ method.description }}</p>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in method.features"
                  :key="feature"
                  class="bg-muted/50 text-muted-foreground inline-flex items-center rounded-full px-2 py-1 text-xs"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Payment Details Section -->
      <div
        v-if="localPaymentMethod === 'online'"
        class="bg-card border-border rounded-lg border p-6"
      >
        <h3 class="text-foreground mb-4 font-semibold">Online Payment Setup</h3>

        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Payment Schedule
              </label>
              <SelectInput
                v-model="paymentSchedule"
                :options="scheduleOptions"
                placeholder="Select payment schedule"
              />
            </div>

            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Escrow Protection
              </label>
              <SelectInput
                v-model="escrowProtection"
                :options="escrowOptions"
                placeholder="Select escrow option"
              />
            </div>
          </div>

          <div
            class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
          >
            <div class="flex items-start space-x-3">
              <Icon
                name="mdi:information"
                class="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400"
              />
              <div>
                <h4 class="mb-1 font-medium text-blue-900 dark:text-blue-100">
                  Online Payment Benefits
                </h4>
                <ul class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Secure escrow protection for both parties</li>
                  <li>• Automatic payment processing upon job completion</li>
                  <li>• Built-in dispute resolution system</li>
                  <li>• Professional invoicing and tax documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Direct Payment Details Section -->
      <div
        v-if="localPaymentMethod === 'direct'"
        class="bg-card border-border rounded-lg border p-6"
      >
        <h3 class="text-foreground mb-4 font-semibold">Direct Payment Information</h3>

        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Payment Timeline
              </label>
              <SelectInput
                v-model="paymentTimeline"
                :options="timelineOptions"
                placeholder="Select payment timeline"
              />
            </div>

            <div>
              <label class="text-foreground mb-2 block text-sm font-medium">
                Preferred Payment Method
              </label>
              <SelectInput
                v-model="preferredMethod"
                :options="preferredMethodOptions"
                placeholder="Select preferred method"
              />
            </div>
          </div>

          <div
            class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20"
          >
            <div class="flex items-start space-x-3">
              <Icon
                name="mdi:check-circle"
                class="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400"
              />
              <div>
                <h4 class="mb-1 font-medium text-green-900 dark:text-green-100">
                  Direct Payment Benefits
                </h4>
                <ul class="space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>• No platform fees - keep 100% of your budget</li>
                  <li>• Direct relationship with talent</li>
                  <li>• Flexible payment terms and methods</li>
                  <li>• Faster payment processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div v-if="localPaymentMethod" class="bg-muted/50 rounded-lg p-4">
        <h4 class="text-foreground mb-2 font-medium">Payment Summary</h4>
        <div class="text-muted-foreground space-y-1 text-sm">
          <div class="flex justify-between">
            <span>Method:</span>
            <span class="text-foreground font-medium">{{
              getPaymentMethodLabel(localPaymentMethod)
            }}</span>
          </div>
          <div v-if="localPaymentMethod === 'online' && paymentSchedule">
            <div class="flex justify-between">
              <span>Schedule:</span>
              <span class="text-foreground font-medium">{{ paymentSchedule }}</span>
            </div>
            <div v-if="escrowProtection" class="flex justify-between">
              <span>Escrow:</span>
              <span class="text-foreground font-medium">{{ escrowProtection }}</span>
            </div>
          </div>
          <div v-if="localPaymentMethod === 'direct' && paymentTimeline">
            <div class="flex justify-between">
              <span>Timeline:</span>
              <span class="text-foreground font-medium">{{ paymentTimeline }}</span>
            </div>
            <div v-if="preferredMethod" class="flex justify-between">
              <span>Method:</span>
              <span class="text-foreground font-medium">{{ preferredMethod }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button variant="primary" size="lg" @click="handleNext" :disabled="!isValid">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'

interface PaymentDetails {
  method: 'direct' | 'online'
  schedule?: string
  escrowProtection?: string
  timeline?: string
  preferredMethod?: string
}

interface Props {
  paymentDetails: PaymentDetails
}

interface Emits {
  (e: 'update:paymentDetails', value: PaymentDetails): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localPaymentMethod = ref(props.paymentDetails.method)
const paymentSchedule = ref(props.paymentDetails.schedule || '')
const escrowProtection = ref(props.paymentDetails.escrowProtection || '')
const paymentTimeline = ref(props.paymentDetails.timeline || '')
const preferredMethod = ref(props.paymentDetails.preferredMethod || '')

// Payment method options
const paymentMethods = [
  {
    value: 'direct',
    title: 'Pay Directly to Talent',
    subtitle: 'Default option - no platform fees',
    icon: 'mdi:handshake',
    description:
      "You'll handle payments directly with the selected talent after job completion. This option has no platform fees and gives you full control over the payment process.",
    features: ['No platform fees', 'Direct relationship', 'Flexible terms', 'Faster processing'],
  },
  {
    value: 'online',
    title: 'Online Payment (Escrow)',
    subtitle: 'Secure platform-managed payments',
    icon: 'mdi:shield-check',
    description:
      'Use our secure online payment system with escrow protection. Funds are held safely until job completion, providing security for both parties.',
    features: [
      'Escrow protection',
      'Dispute resolution',
      'Automatic processing',
      'Tax documentation',
    ],
  },
]

// Online payment options
const scheduleOptions = [
  { value: 'upon_completion', label: 'Upon Job Completion' },
  { value: 'milestone_based', label: 'Milestone-based' },
  { value: 'weekly', label: 'Weekly Payments' },
  { value: 'monthly', label: 'Monthly Payments' },
]

const escrowOptions = [
  { value: 'standard', label: 'Standard Protection (3 days)' },
  { value: 'extended', label: 'Extended Protection (7 days)' },
  { value: 'premium', label: 'Premium Protection (14 days)' },
]

// Direct payment options
const timelineOptions = [
  { value: 'immediate', label: 'Immediate (within 24 hours)' },
  { value: '3_days', label: 'Within 3 days' },
  { value: '1_week', label: 'Within 1 week' },
  { value: '2_weeks', label: 'Within 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
]

const preferredMethodOptions = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'wise', label: 'Wise (formerly TransferWise)' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'other', label: 'Other (specify in job description)' },
]

// Computed properties
const isValid = computed(() => {
  return !!localPaymentMethod.value
})

// Methods
const getPaymentMethodLabel = (method: string) => {
  const option = paymentMethods.find((m) => m.value === method)
  return option?.title || method
}

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handlePrevious = () => {
  emit('previous')
}

// Watch for changes and emit updates
watch(
  [localPaymentMethod, paymentSchedule, escrowProtection, paymentTimeline, preferredMethod],
  () => {
    const paymentDetails: PaymentDetails = {
      method: localPaymentMethod.value as 'direct' | 'online',
      schedule: paymentSchedule.value || undefined,
      escrowProtection: escrowProtection.value || undefined,
      timeline: paymentTimeline.value || undefined,
      preferredMethod: preferredMethod.value || undefined,
    }
    emit('update:paymentDetails', paymentDetails)
  },
  { deep: true },
)
</script>
