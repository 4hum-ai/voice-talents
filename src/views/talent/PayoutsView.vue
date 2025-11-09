<template>
  <div>
    <div class="mx-auto max-w-6xl">
      <!-- Current Balance Section -->
      <div class="mb-8">
        <BalanceCard v-if="balance" :balance="balance" @payout-requested="handlePayoutRequested" />
        <div
          v-else-if="isLoadingBalance"
          class="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
        >
          <div class="flex items-center justify-center">
            <Icon name="mdi:loading" class="h-6 w-6 animate-spin text-gray-400" />
            <span class="text-muted-foreground ml-2">Loading balance...</span>
          </div>
        </div>
        <div v-else class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <p class="text-muted-foreground text-sm">
            Unable to load balance. Please try again later.
          </p>
        </div>
      </div>

      <!-- Payout History Section -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-foreground text-lg font-semibold">Payout History</h3>
          <Button variant="ghost" size="sm" :disabled="isLoadingHistory" @click="refreshHistory">
            <Icon
              name="mdi:refresh"
              class="mr-1 h-4 w-4"
              :class="{ 'animate-spin': isLoadingHistory }"
            />
            Refresh
          </Button>
        </div>
        <Card>
          <div v-if="isLoadingHistory" class="flex items-center justify-center p-8">
            <Icon name="mdi:loading" class="h-6 w-6 animate-spin text-gray-400" />
            <span class="text-muted-foreground ml-2">Loading payout history...</span>
          </div>
          <div v-else-if="payoutHistory.length === 0" class="p-8 text-center">
            <Icon name="mdi:wallet-outline" class="mx-auto h-12 w-12 text-gray-400" />
            <p class="text-muted-foreground mt-2 text-sm">No payout history yet.</p>
            <p class="text-muted-foreground mt-1 text-xs">
              Your payout requests will appear here once you start earning.
            </p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Date
                  </th>
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Amount
                  </th>
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Fees
                  </th>
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Net Amount
                  </th>
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Status
                  </th>
                  <th
                    class="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase"
                  >
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="payout in payoutHistory"
                  :key="payout.id"
                  class="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <td class="px-4 py-3 text-sm">
                    {{ formatDate(payout.payoutDate) }}
                  </td>
                  <td class="px-4 py-3 text-sm font-medium">
                    {{ formatCurrency(payout.amount, payout.currency) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">
                    {{ formatCurrency(payout.processingFee, payout.currency) }}
                  </td>
                  <td class="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                    {{ formatCurrency(payout.netAmount, payout.currency) }}
                  </td>
                  <td class="px-4 py-3">
                    <StatusBadge :status="mapPayoutStatus(payout.status)" />
                  </td>
                  <td class="px-4 py-3 font-mono text-sm text-xs text-gray-500">
                    {{ payout.transactionId || 'N/A' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import BalanceCard from '@/components/molecules/BalanceCard.vue'
import { usePayout } from '@/composables/usePayout'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const { success, error } = useToast()
const authStore = useAuthStore()

const {
  balance,
  payoutHistory,
  isLoadingBalance,
  isLoadingHistory,
  fetchBalance,
  fetchPayoutHistory,
  requestPayout,
} = usePayout()

const handlePayoutRequested = async (amount: number) => {
  if (!authStore.user?.id) {
    error('User not authenticated')
    return
  }

  try {
    await requestPayout(authStore.user.id, amount, balance.value?.currency || 'USD')
    success(
      `Payout request for ${formatCurrency(amount, balance.value?.currency || 'USD')} submitted successfully`,
    )
    await fetchBalance(authStore.user.id)
    await refreshHistory()
  } catch (err) {
    error(err instanceof Error ? err.message : 'Failed to request payout')
  }
}

const refreshHistory = async () => {
  if (!authStore.user?.id) return
  await fetchPayoutHistory(authStore.user.id)
}

// Load data on mount
onMounted(async () => {
  if (!authStore.user?.id) return

  await Promise.all([fetchBalance(authStore.user.id), fetchPayoutHistory(authStore.user.id)])
})

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const mapPayoutStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    processing: 'processing',
    completed: 'success',
    failed: 'error',
  }
  return statusMap[status] || 'pending'
}
</script>
