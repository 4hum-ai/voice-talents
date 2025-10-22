/**
 * Job rating and evaluation interfaces
 */

import type { Budget } from './budget'

export interface JobRating {
  jobTitle: string
  talentId: string
  talentName: string
  voiceType: string // Changed from projectType to voiceType
  budget: Budget
  timeline: string
  completedDate: string
}

export interface JobRatingModalProps {
  open: boolean
  jobTitle: string
  talentId: string
  talentName: string
  voiceType: string // Changed from projectType to voiceType
  budget: Budget
  timeline: string
  completedDate: string
  onClose?: () => void
}
