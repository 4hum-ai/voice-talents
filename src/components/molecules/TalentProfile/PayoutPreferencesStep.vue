<template>
  <div class="space-y-8">
    <div class="text-center">
      <h3 class="text-foreground mb-2 text-2xl font-semibold">Payout Preferences</h3>
      <p class="text-muted-foreground">Choose how you'd like to receive your earnings.</p>
    </div>

    <div class="space-y-6">
      <!-- Payout Frequency Selection -->
      <div class="space-y-4">
        <!-- Monthly Automatic Payout -->
        <label
          class="border-border bg-card flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-md"
          :class="{
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20': payoutData.frequency === 'monthly',
          }"
        >
          <input
            v-model="payoutData.frequency"
            type="radio"
            value="monthly"
            class="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex-1">
            <div class="flex items-center">
              <Icon name="mdi:calendar-month" class="mr-2 h-5 w-5 text-blue-600" />
              <span class="text-foreground font-semibold">Monthly Automatic Payout</span>
            </div>
            <p class="text-muted-foreground mt-1 text-sm">
              Receive your earnings automatically on the 1st of each month. All available balance
              will be paid out.
            </p>
          </div>
        </label>

        <!-- Threshold-Based Payout -->
        <label
          class="border-border bg-card flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-md"
          :class="{
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20': payoutData.frequency === 'threshold',
          }"
        >
          <input
            v-model="payoutData.frequency"
            type="radio"
            value="threshold"
            class="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex-1">
            <div class="flex items-center">
              <Icon name="mdi:target" class="mr-2 h-5 w-5 text-green-600" />
              <span class="text-foreground font-semibold">Threshold-Based Payout</span>
            </div>
            <p class="text-muted-foreground mt-1 text-sm">
              Automatically receive payouts when your balance reaches a certain amount.
            </p>
            <!-- Threshold Amount Input -->
            <div v-if="payoutData.frequency === 'threshold'" class="mt-4">
              <label for="threshold-amount" class="text-foreground mb-2 block text-sm font-medium">
                Payout Threshold Amount
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="dark:text-muted-foreground text-sm text-gray-500">$</span>
                </div>
                <input
                  id="threshold-amount"
                  v-model.number="payoutData.thresholdAmount"
                  type="number"
                  min="5"
                  step="50"
                  placeholder="500"
                  class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  @input="updatePayoutData"
                />
              </div>
              <p class="text-muted-foreground mt-1 text-xs">
                Minimum threshold: $5.00 (to cover payout fees)
              </p>
            </div>
          </div>
        </label>

        <!-- Manual Payout -->
        <label
          class="border-border bg-card flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-md"
          :class="{
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20': payoutData.frequency === 'manual',
          }"
        >
          <input
            v-model="payoutData.frequency"
            type="radio"
            value="manual"
            class="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex-1">
            <div class="flex items-center">
              <Icon name="mdi:hand-coin" class="mr-2 h-5 w-5 text-purple-600" />
              <span class="text-foreground font-semibold">Manual Payout (Request Anytime)</span>
            </div>
            <p class="text-muted-foreground mt-1 text-sm">
              Request payouts manually whenever you want. You have full control over when to
              withdraw your earnings.
            </p>
          </div>
        </label>
      </div>

      <!-- Currency Selection -->
      <div class="space-y-2">
        <label for="currency" class="text-foreground block text-sm font-medium">
          Preferred Currency
        </label>
        <select
          id="currency"
          v-model="payoutData.currency"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updatePayoutData"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="KRW">KRW - South Korean Won</option>
          <option value="CNY">CNY - Chinese Yuan</option>
          <option value="INR">INR - Indian Rupee</option>
        </select>
        <p class="text-muted-foreground text-xs">
          Note: Currency conversion may apply FX fees (0.5%) if different from your local currency.
        </p>
      </div>

      <!-- Fee Information -->
      <div class="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <div class="flex items-start">
          <Icon name="mdi:alert-circle" class="mt-0.5 mr-2 h-5 w-5 text-amber-600" />
          <div>
            <h4 class="text-foreground mb-1 font-semibold">Payout Fees</h4>
            <ul class="text-muted-foreground mt-2 list-inside list-disc text-sm">
              <li>1.5% of payout amount</li>
              <li>$1.50 fixed fee per payout</li>
              <li>0.5% FX fee (if currency conversion needed)</li>
              <li>Minimum payout: $5.00</li>
            </ul>
            <p class="text-muted-foreground mt-2 text-xs">
              Example: For a $100 payout, fees would be $3.00 (1.5% = $1.50 + $1.50 fixed), net
              amount: $97.00
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import Icon from '@/components/atoms/Icon.vue'
import type { PayoutPreferences } from '@/types/models'

interface Props {
  payoutData: PayoutPreferences
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<PayoutPreferences>]
}>()

const payoutData = reactive<PayoutPreferences>({
  frequency: props.payoutData.frequency || 'manual',
  thresholdAmount: props.payoutData.thresholdAmount || 500,
  currency: props.payoutData.currency || 'USD',
})

// Watch for changes and emit updates
watch(
  () => payoutData,
  (newData) => {
    emit('update', { ...newData })
  },
  { deep: true },
)

const updatePayoutData = () => {
  emit('update', { ...payoutData })
}

// Initialize with default if threshold is selected
if (payoutData.frequency === 'threshold' && !payoutData.thresholdAmount) {
  payoutData.thresholdAmount = 500
}
</script>
