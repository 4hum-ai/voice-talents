/**
 * Budget and currency-related interfaces
 */

export interface Budget {
  min: number
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

export interface BudgetDisplay {
  min: number
  max: number
  currency: string // For display purposes
}
