/**
 * Job rating and evaluation interfaces
 */

import type { Budget } from './budget'

export interface JobRating {
  jobTitle: string
  talentId: string
  talentName: string
  voiceType: string
  budget: Budget
  completedDate: string
}

export interface JobRatingModalProps {
  open: boolean
  jobTitle: string
  talentId: string
  talentName: string
  voiceType: string
  budget: Budget
  completedDate: string
  onClose?: () => void
}
