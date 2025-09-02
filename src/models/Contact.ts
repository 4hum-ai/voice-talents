import type { BaseEntity } from './BaseEntity'

// Contact-specific types
export type ContactStatus = 'active' | 'inactive' | 'archived'
export type PreferredContactMethod = 'email' | 'phone' | 'sms'

export interface Contact extends BaseEntity {
  // Core identity
  name: string
  email: string
  phone?: string
  role?: string
  department?: string
  status: ContactStatus

  // Address
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string

  // Preferences
  preferredContactMethod?: PreferredContactMethod
  timezone?: string
  language?: string

  // Additional
  notes?: string
  avatar?: string

  // Relationships
  organizationId?: string
}
