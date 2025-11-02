<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
      >
        <Icon name="mdi:file-document-check" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Review Agreement</h2>
      <p class="text-muted-foreground text-base">
        Please review the {{ agreementType === 'service' ? 'Service' : 'Royalty' }} Agreement before
        finalizing.
      </p>
    </div>

    <!-- Agreement Type Badge -->
    <div class="flex justify-center">
      <div
        class="inline-flex items-center rounded-full px-4 py-2"
        :class="
          agreementType === 'service'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        "
      >
        <Icon
          :name="agreementType === 'service' ? 'mdi:briefcase-check' : 'mdi:music-note'"
          class="mr-2 h-5 w-5"
        />
        <span class="font-semibold">
          {{ agreementType === 'service' ? 'Service Agreement' : 'Royalty Agreement' }}
        </span>
      </div>
    </div>

    <!-- Agreement Details Card -->
    <Card class="p-6">
      <div class="space-y-6">
        <!-- Project Details -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Project Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Project Title:</span>
              <span class="text-foreground font-medium">{{ agreementData.projectTitle }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Client:</span>
              <span class="text-foreground font-medium">{{ agreementData.clientName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Talent:</span>
              <span class="text-foreground font-medium">{{ agreementData.talentName }}</span>
            </div>
          </div>
        </div>

        <div class="border-border border-t"></div>

        <!-- Payment Terms -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">
            {{ agreementType === 'service' ? 'Payment Terms' : 'Royalty Terms' }}
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">
                {{ agreementType === 'service' ? 'Service Fee' : 'Royalty Rate' }}:
              </span>
              <span class="text-foreground font-medium">
                {{ formatCurrency(agreementData.amount, agreementData.currency) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Timeline:</span>
              <span class="text-foreground font-medium">{{ agreementData.timeline }}</span>
            </div>
            <div v-if="agreementData.revisionRounds" class="flex justify-between">
              <span class="text-muted-foreground">Revision Rounds:</span>
              <span class="text-foreground font-medium">{{ agreementData.revisionRounds }}</span>
            </div>
          </div>
        </div>

        <div class="border-border border-t"></div>

        <!-- Intellectual Property -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Intellectual Property</h3>
          <div class="bg-muted/30 rounded-lg p-4">
            <p class="text-sm leading-relaxed">
              <template v-if="agreementType === 'service'">
                <strong>Work-for-Hire:</strong> Upon delivery of voice work, all intellectual
                property rights in the delivered work product will automatically become the
                exclusive property of the client. This is a work-for-hire arrangement.
              </template>
              <template v-else>
                <strong>Voice Licensing:</strong> The client receives a license to use the talent's
                voice for AI synthesis according to the terms specified. The talent retains
                ownership of their voice, and the client will pay royalties as specified.
              </template>
            </p>
          </div>
        </div>

        <div class="border-border border-t"></div>

        <!-- Payment & Delivery -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Payment & Delivery</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-start gap-2">
              <Icon name="mdi:check-circle" class="h-5 w-5 shrink-0 text-green-500" />
              <span class="text-muted-foreground">
                Payment is secured in escrow and will be automatically released upon delivery and
                approval, or after 5 days without complaints.
              </span>
            </div>
            <div class="flex items-start gap-2">
              <Icon name="mdi:clock-outline" class="h-5 w-5 shrink-0 text-blue-500" />
              <span class="text-muted-foreground">
                Client has 5 days from delivery to raise any disputes. After this period,
                deliverables are automatically accepted.
              </span>
            </div>
          </div>
        </div>

        <div class="border-border border-t"></div>

        <!-- Agreement Template Link -->
        <div>
          <h3 class="text-foreground mb-3 text-lg font-semibold">Agreement Template</h3>
          <div
            class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
          >
            <div class="flex items-start gap-3">
              <Icon
                name="mdi:information"
                class="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
              />
              <div class="flex-1">
                <p class="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                  Reference Agreement Template:
                </p>
                <RouterLink
                  :to="templateUrl"
                  target="_blank"
                  class="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm underline"
                >
                  <Icon name="mdi:open-in-new" class="h-4 w-4" />
                  View {{ agreementType === 'service' ? 'Service' : 'Royalty' }} Agreement Template
                </RouterLink>
                <p class="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  This agreement is based on the standard template. Review the full template for all
                  terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Acceptance Checkbox -->
    <Card class="p-6">
      <label class="flex cursor-pointer items-start gap-3">
        <input
          v-model="localAccepted"
          type="checkbox"
          required
          class="text-primary focus:ring-primary mt-0.5 h-5 max-h-[1.25rem] min-h-[1.25rem] w-5 max-w-[1.25rem] min-w-[1.25rem] shrink-0 cursor-pointer rounded border-gray-300 bg-white focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
        />
        <span class="text-foreground text-sm leading-relaxed">
          I have reviewed and agree to the terms of this
          {{ agreementType === 'service' ? 'Service' : 'Royalty' }} Agreement. I understand that
          this agreement is binding upon approval.
        </span>
      </label>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-between gap-4">
      <Button variant="outline" size="lg" @click="$emit('cancel')">
        <Icon name="mdi:close" class="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button variant="primary" size="lg" :disabled="!localAccepted" @click="$emit('approve')">
        <Icon name="mdi:check-circle" class="mr-2 h-4 w-4" />
        Approve & Create Agreement
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface AgreementData {
  projectTitle: string
  clientName: string
  talentName: string
  amount: number
  currency: string
  timeline: string
  revisionRounds?: string
}

interface Props {
  agreementType: 'service' | 'royalty'
  agreementData: AgreementData
  accepted?: boolean
}

interface Emits {
  (e: 'update:accepted', value: boolean): void
  (e: 'approve'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localAccepted = ref(props.accepted || false)

// Agreement template URL based on type
const templateUrl = computed(() => {
  if (props.agreementType === 'service') {
    return '/content/agreement-template-service'
  }
  return '/content/agreement-template-royalty'
})

// Format currency
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

// Watch for changes
watch(localAccepted, (value) => {
  emit('update:accepted', value)
})

watch(
  () => props.accepted,
  (value) => {
    localAccepted.value = value || false
  },
)
</script>
