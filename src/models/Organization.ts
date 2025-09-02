import type { BaseEntity } from './BaseEntity'

// Organization-specific types
export type OrganizationType = 'publisher' | 'partner' | 'vendor' | 'client' | 'affiliate'
export type OrganizationStatus = 'active' | 'pending' | 'suspended' | 'inactive'
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
export type ServiceLevel = 'basic' | 'premium' | 'enterprise'
export type ContractType = 'monthly' | 'annual' | 'enterprise'

export interface Organization extends BaseEntity {
  // Core identity
  name: string
  type: OrganizationType
  status: OrganizationStatus
  email: string
  website?: string
  phone?: string

  // Location
  country: string
  address: string

  // Business classification
  companySize?: CompanySize
  industry?: string
  annualRevenue?: number
  currency?: string

  // Legal & Financial
  legalEntityName?: string
  taxId?: string

  // Contract & Service
  contractType?: ContractType
  serviceLevel?: ServiceLevel
  contractStartDate?: string
  contractEndDate?: string
  accountManagerId?: string

  // Performance metrics
  totalRevenue?: number
  monthlyRevenue?: number
  totalMovies?: number
  totalViews?: number
  averageRating?: number
  lastActivityDate?: string
  onboardingStatus?: 'pending' | 'in_progress' | 'completed'
}
