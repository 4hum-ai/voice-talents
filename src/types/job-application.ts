export interface CustomSample {
  id: string
  title: string
  description: string
  audioUrl: string
  duration?: number
  format?: 'mp3' | 'wav' | 'aac' | 'flac'
  fileSize?: number
}

export type ApplicationStatus = 'submitted' | 'under_review' | 'shortlisted' | 'selected' | 'rejected'

export interface Application {
  id: string
  jobId: string
  voiceActorId: string
  voiceActorName: string
  status: ApplicationStatus
  appliedDate: string

  proposedCost: number
  proposedCurrency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
  proposedTimeline: string

  customSamples: CustomSample[]
  personalNote: string
}


