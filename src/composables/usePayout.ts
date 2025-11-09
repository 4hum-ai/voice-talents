import { ref, computed } from 'vue'
import { useResourceService } from './useResourceService'
import type { Payout, PayoutPreferences, TalentBalance, PayoutFeeCalculation } from '@/types/models'

/**
 * Payout fee constants - Stripe global payout fees passed through to users
 */
export const PAYOUT_FEES = {
  /** Percentage fee: 1.5% of payout amount */
  PERCENTAGE_RATE: 0.015,
  /** Fixed fee: $1.50 per payout */
  FIXED_FEE: 1.5,
  /** FX fee: 0.5% for currency conversion (if applicable) */
  FX_RATE: 0.005,
  /** Minimum payout amount: $5.00 */
  MINIMUM_PAYOUT: 5.0,
} as const

/**
 * Calculate payout fees and net amount
 * @param amount - Payout amount
 * @param currency - Currency code (default: USD)
 * @param needsFxConversion - Whether FX conversion is needed (default: false)
 * @returns PayoutFeeCalculation with all fee breakdowns
 */
export function calculatePayoutFees(
  amount: number,
  currency: string = 'USD',
  needsFxConversion: boolean = false,
): PayoutFeeCalculation {
  const percentageFee = amount * PAYOUT_FEES.PERCENTAGE_RATE
  const fixedFee = PAYOUT_FEES.FIXED_FEE
  const fxFee = needsFxConversion ? amount * PAYOUT_FEES.FX_RATE : 0
  const totalFees = percentageFee + fixedFee + fxFee
  const netAmount = Math.max(0, amount - totalFees)

  return {
    amount,
    percentageFee,
    fixedFee,
    fxFee,
    totalFees,
    netAmount,
    currency,
  }
}

/**
 * Validate if payout amount meets minimum requirement
 * @param amount - Payout amount
 * @returns True if amount meets minimum, false otherwise
 */
export function validateMinimumPayout(amount: number): boolean {
  return amount >= PAYOUT_FEES.MINIMUM_PAYOUT
}

/**
 * Composable for managing talent payouts
 * Provides reactive state and methods for payout operations
 */
export function usePayout() {
  const resourceService = useResourceService('movie/api')
  const balanceService = useResourceService('movie/api')
  const preferencesService = useResourceService('movie/api')

  // Reactive state
  const balance = ref<TalentBalance | null>(null)
  const payoutHistory = ref<Payout[]>([])
  const preferences = ref<PayoutPreferences | null>(null)
  const isLoadingBalance = ref(false)
  const isLoadingHistory = ref(false)
  const isLoadingPreferences = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch current talent balance
   */
  const fetchBalance = async (talentId: string): Promise<void> => {
    isLoadingBalance.value = true
    error.value = null
    try {
      const data = await balanceService.getById('talent-balance', talentId)
      balance.value = data as TalentBalance
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch balance'
      console.error('Error fetching balance:', err)
    } finally {
      isLoadingBalance.value = false
    }
  }

  /**
   * Fetch payout history
   */
  const fetchPayoutHistory = async (
    talentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<void> => {
    isLoadingHistory.value = true
    error.value = null
    try {
      const result = await resourceService.list('payouts', {
        page,
        limit,
        organizationId: talentId,
      })
      payoutHistory.value = result.data as unknown as Payout[]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch payout history'
      console.error('Error fetching payout history:', err)
    } finally {
      isLoadingHistory.value = false
    }
  }

  /**
   * Fetch payout preferences
   */
  const fetchPreferences = async (talentId: string): Promise<void> => {
    isLoadingPreferences.value = true
    error.value = null
    try {
      const data = await preferencesService.getById('talent-payout-preferences', talentId)
      preferences.value = data as PayoutPreferences
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch preferences'
      console.error('Error fetching preferences:', err)
    } finally {
      isLoadingPreferences.value = false
    }
  }

  /**
   * Update payout preferences
   */
  const updatePreferences = async (talentId: string, prefs: PayoutPreferences): Promise<void> => {
    isLoadingPreferences.value = true
    error.value = null
    try {
      const data = await preferencesService.update('talent-payout-preferences', talentId, prefs)
      preferences.value = data as PayoutPreferences
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update preferences'
      console.error('Error updating preferences:', err)
      throw err
    } finally {
      isLoadingPreferences.value = false
    }
  }

  /**
   * Request a payout
   * @param talentId - Talent user ID
   * @param amount - Payout amount
   * @param currency - Currency code
   * @returns Created payout record
   */
  const requestPayout = async (
    talentId: string,
    amount: number,
    currency: string = 'USD',
  ): Promise<Payout> => {
    // Validate minimum payout
    if (!validateMinimumPayout(amount)) {
      throw new Error(`Minimum payout amount is $${PAYOUT_FEES.MINIMUM_PAYOUT}`)
    }

    // Calculate fees
    const feeCalculation = calculatePayoutFees(amount, currency, false)

    error.value = null
    try {
      const payoutData = {
        amount,
        currency,
        organizationId: talentId,
        processingFee: feeCalculation.totalFees,
        netAmount: feeCalculation.netAmount,
        status: 'pending',
        payoutDate: new Date().toISOString(),
        paymentMethod: 'stripe',
        description: `Payout request for ${currency} ${amount.toFixed(2)}`,
      }

      const data = await resourceService.create('payouts', payoutData)
      return data as Payout
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to request payout'
      console.error('Error requesting payout:', err)
      throw err
    }
  }

  // Computed properties
  const hasBalance = computed(() => balance.value !== null)
  const hasAvailableBalance = computed(() => (balance.value?.availableBalance ?? 0) > 0)
  const canRequestPayout = computed(() => {
    if (!balance.value) return false
    return balance.value.availableBalance >= PAYOUT_FEES.MINIMUM_PAYOUT
  })
  const availableBalance = computed(() => balance.value?.availableBalance ?? 0)
  const pendingBalance = computed(() => balance.value?.pendingBalance ?? 0)

  return {
    // State
    balance,
    payoutHistory,
    preferences,
    isLoadingBalance,
    isLoadingHistory,
    isLoadingPreferences,
    error,

    // Methods
    fetchBalance,
    fetchPayoutHistory,
    fetchPreferences,
    updatePreferences,
    requestPayout,

    // Computed
    hasBalance,
    hasAvailableBalance,
    canRequestPayout,
    availableBalance,
    pendingBalance,

    // Utilities
    calculatePayoutFees,
    validateMinimumPayout,
    PAYOUT_FEES,
  }
}
