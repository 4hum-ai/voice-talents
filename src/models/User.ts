import type { BaseEntity } from './BaseEntity'

// User-specific types
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User extends BaseEntity {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  timezone?: string
  language?: string
  organizationId?: string
  organizationName?: string
  lastLoginAt?: string
  loginCount?: number
  isEmailVerified?: boolean
}
