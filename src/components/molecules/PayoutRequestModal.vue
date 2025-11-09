<template>
  <Modal v-model="isOpen" title="Request Payout" size="md">
    <template #content>
      <div class="space-y-6">
        <!-- Current Balance Display -->
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-sm">Available Balance</span>
            <span class="text-foreground text-lg font-semibold">
              {{ formatCurrency(balance.availableBalance, balance.currency) }}
            </span>
          </div>
          <div v-if="balance.pendingBalance > 0" class="mt-2 flex items-center justify-between">
            <span class="text-muted-foreground text-sm">Pending</span>
            <span class="text-muted-foreground text-sm">
              {{ formatCurrency(balance.pendingBalance, balance.currency) }}
            </span>
          </div>
        </div>

        <!-- Payout Amount Input -->
        <div class="space-y-2">
          <label for="payout-amount" class="text-foreground block text-sm font-medium">
            Payout Amount
          </label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-muted-foreground text-sm">{{
                getCurrencySymbol(balance.currency)
              }}</span>
            </div>
            <input
              id="payout-amount"
              v-model.number="payoutAmount"
              type="number"
              :min="PAYOUT_FEES.MINIMUM_PAYOUT"
              :max="balance.availableBalance"
              step="0.01"
              :placeholder="`Min: ${formatCurrency(PAYOUT_FEES.MINIMUM_PAYOUT, balance.currency)}`"
              class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              @input="updateFeeCalculation"
            />
          </div>
          <div class="flex items-center justify-between text-xs">
            <button
              type="button"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              @click="payoutAmount = balance.availableBalance"
            >
              Use full balance
            </button>
            <span class="text-muted-foreground">
              Min: {{ formatCurrency(PAYOUT_FEES.MINIMUM_PAYOUT, balance.currency) }}
            </span>
          </div>
        </div>

        <!-- Fee Breakdown -->
        <div
          v-if="feeCalculation"
          class="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <h4 class="text-foreground text-sm font-semibold">Fee Breakdown</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Payout Amount</span>
              <span class="text-foreground font-medium">
                {{ formatCurrency(feeCalculation.amount, balance.currency) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Percentage Fee (1.5%)</span>
              <span class="text-foreground">
                {{ formatCurrency(feeCalculation.percentageFee, balance.currency) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Fixed Fee</span>
              <span class="text-foreground">
                {{ formatCurrency(feeCalculation.fixedFee, balance.currency) }}
              </span>
            </div>
            <div v-if="feeCalculation.fxFee > 0" class="flex justify-between">
              <span class="text-muted-foreground">FX Fee (0.5%)</span>
              <span class="text-foreground">
                {{ formatCurrency(feeCalculation.fxFee, balance.currency) }}
              </span>
            </div>
            <div class="border-t border-gray-300 pt-2 dark:border-gray-600">
              <div class="flex justify-between">
                <span class="text-foreground font-semibold">Total Fees</span>
                <span class="text-foreground font-semibold">
                  {{ formatCurrency(feeCalculation.totalFees, balance.currency) }}
                </span>
              </div>
            </div>
            <div class="border-t border-green-500 pt-2">
              <div class="flex justify-between">
                <span class="text-foreground font-bold">Net Amount (You'll Receive)</span>
                <span class="text-lg font-bold text-green-600 dark:text-green-400">
                  {{ formatCurrency(feeCalculation.netAmount, balance.currency) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Info Message -->
        <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p class="text-xs text-blue-600 dark:text-blue-400">
            <Icon name="mdi:information" class="mr-1 inline h-4 w-4" />
            All Stripe payout fees are passed through to you. Payouts typically process within 1-3
            business days.
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button variant="ghost" @click="closeModal">Cancel</Button>
        <Button
          variant="primary"
          :disabled="!isValidPayout || isSubmitting"
          @click="handleRequestPayout"
        >
          <Icon v-if="isSubmitting" name="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSubmitting ? 'Processing...' : 'Request Payout' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/molecules/Modal.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import type { TalentBalance, PayoutFeeCalculation } from '@/types/models'
import { calculatePayoutFees, validateMinimumPayout, PAYOUT_FEES } from '@/composables/usePayout'

interface Props {
  modelValue: boolean
  balance: TalentBalance
  canRequest: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  payoutRequested: [amount: number]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const payoutAmount = ref<number>(0)
const feeCalculation = ref<PayoutFeeCalculation | null>(null)
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

const isValidPayout = computed(() => {
  if (!payoutAmount.value || payoutAmount.value <= 0) return false
  if (!validateMinimumPayout(payoutAmount.value)) return false
  if (payoutAmount.value > props.balance.availableBalance) return false
  return true
})

const updateFeeCalculation = () => {
  errorMessage.value = null

  if (!payoutAmount.value || payoutAmount.value <= 0) {
    feeCalculation.value = null
    return
  }

  if (!validateMinimumPayout(payoutAmount.value)) {
    errorMessage.value = `Minimum payout amount is ${formatCurrency(PAYOUT_FEES.MINIMUM_PAYOUT, props.balance.currency)}`
    feeCalculation.value = null
    return
  }

  if (payoutAmount.value > props.balance.availableBalance) {
    errorMessage.value = 'Payout amount cannot exceed available balance'
    feeCalculation.value = null
    return
  }

  // Calculate fees (assuming no FX conversion for same currency)
  feeCalculation.value = calculatePayoutFees(payoutAmount.value, props.balance.currency, false)
}

const handleRequestPayout = async () => {
  if (!isValidPayout.value) return

  isSubmitting.value = true
  errorMessage.value = null

  try {
    emit('payoutRequested', payoutAmount.value)
    closeModal()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to request payout'
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  isOpen.value = false
  payoutAmount.value = 0
  feeCalculation.value = null
  errorMessage.value = null
}

// Initialize with minimum payout when modal opens
watch(isOpen, (open) => {
  if (open && props.canRequest) {
    payoutAmount.value = Math.max(PAYOUT_FEES.MINIMUM_PAYOUT, props.balance.availableBalance)
    updateFeeCalculation()
  }
})

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    KRW: '₩',
    CNY: '¥',
    INR: '₹',
  }
  return symbols[currency] || '$'
}
</script>
