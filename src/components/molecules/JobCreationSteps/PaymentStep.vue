<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-foreground mb-2">Payment Method</h2>
      <p class="text-muted-foreground">
        Choose how you'd like to handle payments for this job
      </p>
    </div>

    <div class="space-y-6">
      <!-- Payment Method Options -->
      <div class="space-y-4">
        <div 
          v-for="method in paymentMethods" 
          :key="method.value"
          class="relative"
        >
          <input
            :id="method.value"
            v-model="localPaymentMethod"
            type="radio"
            :value="method.value"
            class="sr-only"
          />
          <label
            :for="method.value"
            class="flex items-start p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
            :class="localPaymentMethod === method.value 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                     :class="method.value === 'direct' ? 'bg-green-500/10' : 'bg-blue-500/10'">
                  <Icon :name="method.icon" 
                        :class="method.value === 'direct' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'" 
                        class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground">{{ method.title }}</h3>
                  <p class="text-sm text-muted-foreground">{{ method.subtitle }}</p>
                </div>
              </div>
              
              <p class="text-sm text-muted-foreground mb-3">{{ method.description }}</p>
              
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="feature in method.features" 
                  :key="feature"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Payment Details Section -->
      <div v-if="localPaymentMethod === 'online'" class="bg-card border border-border rounded-lg p-6">
        <h3 class="font-semibold text-foreground mb-4">Online Payment Setup</h3>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Payment Schedule
              </label>
              <SelectInput
                v-model="paymentSchedule"
                :options="scheduleOptions"
                placeholder="Select payment schedule"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Escrow Protection
              </label>
              <SelectInput
                v-model="escrowProtection"
                :options="escrowOptions"
                placeholder="Select escrow option"
              />
            </div>
          </div>
          
          <div class="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-start space-x-3">
              <Icon name="mdi:information" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-1">Online Payment Benefits</h4>
                <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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
      <div v-if="localPaymentMethod === 'direct'" class="bg-card border border-border rounded-lg p-6">
        <h3 class="font-semibold text-foreground mb-4">Direct Payment Information</h3>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Payment Timeline
              </label>
              <SelectInput
                v-model="paymentTimeline"
                :options="timelineOptions"
                placeholder="Select payment timeline"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Preferred Payment Method
              </label>
              <SelectInput
                v-model="preferredMethod"
                :options="preferredMethodOptions"
                placeholder="Select preferred method"
              />
            </div>
          </div>
          
          <div class="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex items-start space-x-3">
              <Icon name="mdi:check-circle" class="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 class="font-medium text-green-900 dark:text-green-100 mb-1">Direct Payment Benefits</h4>
                <ul class="text-sm text-green-800 dark:text-green-200 space-y-1">
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
        <h4 class="font-medium text-foreground mb-2">Payment Summary</h4>
        <div class="space-y-1 text-sm text-muted-foreground">
          <div class="flex justify-between">
            <span>Method:</span>
            <span class="font-medium text-foreground">{{ getPaymentMethodLabel(localPaymentMethod) }}</span>
          </div>
          <div v-if="localPaymentMethod === 'online' && paymentSchedule">
            <div class="flex justify-between">
              <span>Schedule:</span>
              <span class="font-medium text-foreground">{{ paymentSchedule }}</span>
            </div>
            <div v-if="escrowProtection" class="flex justify-between">
              <span>Escrow:</span>
              <span class="font-medium text-foreground">{{ escrowProtection }}</span>
            </div>
          </div>
          <div v-if="localPaymentMethod === 'direct' && paymentTimeline">
            <div class="flex justify-between">
              <span>Timeline:</span>
              <span class="font-medium text-foreground">{{ paymentTimeline }}</span>
            </div>
            <div v-if="preferredMethod" class="flex justify-between">
              <span>Method:</span>
              <span class="font-medium text-foreground">{{ preferredMethod }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button 
        variant="primary" 
        size="lg" 
        @click="handleNext"
        :disabled="!isValid"
      >
        Continue
        <Icon name="mdi:arrow-right" class="h-4 w-4 ml-2" />
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
    description: 'You\'ll handle payments directly with the selected talent after job completion. This option has no platform fees and gives you full control over the payment process.',
    features: ['No platform fees', 'Direct relationship', 'Flexible terms', 'Faster processing']
  },
  {
    value: 'online',
    title: 'Online Payment (Escrow)',
    subtitle: 'Secure platform-managed payments',
    icon: 'mdi:shield-check',
    description: 'Use our secure online payment system with escrow protection. Funds are held safely until job completion, providing security for both parties.',
    features: ['Escrow protection', 'Dispute resolution', 'Automatic processing', 'Tax documentation']
  }
]

// Online payment options
const scheduleOptions = [
  { value: 'upon_completion', label: 'Upon Job Completion' },
  { value: 'milestone_based', label: 'Milestone-based' },
  { value: 'weekly', label: 'Weekly Payments' },
  { value: 'monthly', label: 'Monthly Payments' }
]

const escrowOptions = [
  { value: 'standard', label: 'Standard Protection (3 days)' },
  { value: 'extended', label: 'Extended Protection (7 days)' },
  { value: 'premium', label: 'Premium Protection (14 days)' }
]

// Direct payment options
const timelineOptions = [
  { value: 'immediate', label: 'Immediate (within 24 hours)' },
  { value: '3_days', label: 'Within 3 days' },
  { value: '1_week', label: 'Within 1 week' },
  { value: '2_weeks', label: 'Within 2 weeks' },
  { value: 'monthly', label: 'Monthly' }
]

const preferredMethodOptions = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'wise', label: 'Wise (formerly TransferWise)' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'other', label: 'Other (specify in job description)' }
]

// Computed properties
const isValid = computed(() => {
  return !!localPaymentMethod.value
})

// Methods
const getPaymentMethodLabel = (method: string) => {
  const option = paymentMethods.find(m => m.value === method)
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
watch([localPaymentMethod, paymentSchedule, escrowProtection, paymentTimeline, preferredMethod], () => {
  const paymentDetails: PaymentDetails = {
    method: localPaymentMethod.value as 'direct' | 'online',
    schedule: paymentSchedule.value || undefined,
    escrowProtection: escrowProtection.value || undefined,
    timeline: paymentTimeline.value || undefined,
    preferredMethod: preferredMethod.value || undefined
  }
  emit('update:paymentDetails', paymentDetails)
}, { deep: true })
</script>
