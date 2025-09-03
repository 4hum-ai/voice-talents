import type { BaseEntity } from './BaseEntity'

// Title-specific types
export type TitleType = 'movie' | 'series' | 'episode' | 'documentary'
export type TitleStatus = 'draft' | 'processing' | 'published' | 'archived'

export interface Title extends BaseEntity {
  // Core identity
  name: string
  type: TitleType
  status: TitleStatus
  description?: string

  // Classification
  year?: number
  director?: string
  duration?: number // in seconds
  genre?: string[]
  language?: string
  rating?: number
  tags?: string[]

  // Media
  poster?: string
  thumbnail?: string

  // Financial
  revenue?: number
  budget?: number
  boxOffice?: number

  // Performance metrics
  totalViews?: number
  averageWatchTime?: number
  completionRate?: number

  // Relationships
  organizationId?: string
  organizationName?: string
  parentTitleId?: string // for episodes
}
