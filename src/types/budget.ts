/**
 * Budget and currency-related interfaces
 */

export interface Budget {
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

export interface BudgetDisplay {
  max: number
  currency: string // For display purposes
}
