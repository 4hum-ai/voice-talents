<template>
  <Card
    class="border-border bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="mb-2 flex items-center space-x-2">
          <Icon name="mdi:wallet" class="h-5 w-5 text-green-600 dark:text-green-400" />
          <h3 class="text-foreground text-sm font-medium">Available Balance</h3>
        </div>
        <div class="mb-1">
          <span class="text-foreground text-3xl font-bold">
            {{ formatCurrency(balance.availableBalance, balance.currency) }}
          </span>
        </div>
        <p v-if="balance.pendingBalance > 0" class="text-muted-foreground text-xs">
          {{ formatCurrency(balance.pendingBalance, balance.currency) }} pending
        </p>
        <p v-else class="text-muted-foreground text-xs">All earnings available</p>
      </div>
      <div class="flex flex-col items-end space-y-2">
        <Button v-if="canRequestPayout" variant="primary" size="sm" @click="showPayoutModal = true">
          <Icon name="mdi:cash-fast" class="mr-1 h-4 w-4" />
          Request Payout
        </Button>
        <Button
          v-else
          variant="outline"
          size="sm"
          disabled
          :title="`Minimum payout is ${formatCurrency(PAYOUT_FEES.MINIMUM_PAYOUT, balance.currency)}`"
        >
          <Icon name="mdi:lock" class="mr-1 h-4 w-4" />
          Request Payout
        </Button>
        <p class="text-muted-foreground text-xs">
          <Icon name="mdi:information" class="mr-1 inline h-3 w-3" />
          Request payout anytime
        </p>
      </div>
    </div>

    <!-- Payout Request Modal -->
    <PayoutRequestModal
      v-model="showPayoutModal"
      :balance="balance"
      :can-request="canRequestPayout"
      @payout-requested="handlePayoutRequested"
    />
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import PayoutRequestModal from '@/components/molecules/PayoutRequestModal.vue'
import type { TalentBalance } from '@/types/models'
import { PAYOUT_FEES } from '@/composables/usePayout'

interface Props {
  balance: TalentBalance
}

const props = defineProps<Props>()

const emit = defineEmits<{
  payoutRequested: [amount: number]
}>()

const showPayoutModal = ref(false)

const canRequestPayout = computed(() => {
  return props.balance.availableBalance >= PAYOUT_FEES.MINIMUM_PAYOUT
})

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const handlePayoutRequested = (amount: number) => {
  emit('payoutRequested', amount)
  showPayoutModal.value = false
}
</script>
