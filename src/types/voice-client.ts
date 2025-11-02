/**
 * TypeScript interfaces for voice client domain models
 */

import type { BaseEntity } from './models'
import type { VoiceType, ProjectType } from './voice-talent'
import type { CustomSample } from './job-application'

// Voice Client Profile - Extended from base User
export interface VoiceClient extends BaseEntity {
  userId: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  avatarUrl?: string
  logoUrl?: string
  website?: string
  location: string
  timezone: string
  industry: string
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  description?: string
  isVerified: boolean
  isPublic: boolean
  totalJobs: number
  activeJobs: number
  completedJobs: number
  totalSpent: number
  averageRating: number
  joinedDate: string
  lastActive: string
  socialLinks: {
    website?: string
    linkedin?: string
    facebook?: string
    twitter?: string
  }
  preferences: {
    defaultBudget: {
      min: number
      max: number
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
    }
    preferredLanguages: string[]
    preferredVoiceTypes: string[]
    autoApprove: boolean
    requireNDA: boolean
  }
}

// Job Posting - Voice acting job created by client
export interface JobPosting extends BaseEntity {
  clientId: string
  clientName: string
  title: string
  description: string
  voiceType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  projectType: string
  status: JobStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget: {
    max: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
  }
  deadline: string
  requirements: {
    language: string
    voiceType: VoiceType
    gender: 'male' | 'female' | 'non-binary' | 'any'
    ageRange?: string
    specialInstructions: string
    deliveryFormat: string
    revisionRounds: string
  }
  files: {
    script?: File
    referenceAudio?: File
    additional?: File[]
  }
  talentOptions: {
    isPublic: boolean
    pickOwn: boolean
    selectedTalents: string[]
  }
  aiSettings?: {
    voiceModel: string
    voiceStyle: string
    emotion: string
    speed: 'slow' | 'normal' | 'fast'
    pitch: 'low' | 'normal' | 'high'
  }
  premiumFeatures: {
    talentOutreach: boolean
    aiMatching: boolean
    autoPrompts: boolean
  }
  paymentDetails: {
    method: 'direct' | 'online'
  }
  isPublic: boolean
  requirePortfolio: boolean

  // Runtime fields (populated after creation)
  applications?: JobApplication[]
  selectedTalents?: string[]
  totalApplications?: number
  viewCount?: number
  createdDate?: string
  publishedDate?: string
  closedDate?: string
  lastSaved?: string
  autoSaved?: boolean
  version?: number
}

// Job Invitation - Direct invitations to specific voice actors for jobs
export interface JobInvitation extends BaseEntity {
  jobId: string
  clientId: string
  voiceTalentId: string
  message?: string
  status: InvitationStatus
  invitedAt: string
  respondedAt?: string
}

// Invitation Status
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'

// Job Application - Voice actor applications to job postings
export interface JobApplication extends BaseEntity {
  jobId: string
  voiceTalentId: string
  voiceTalentName: string
  status: ApplicationStatus
  appliedDate: string
  reviewedDate?: string

  // Application Details
  proposedRate: number
  proposedCurrency: string
  proposedTimeline: string
  estimatedHours: number

  // Portfolio Samples
  portfolioSampleIds: string[]
  customSamples: CustomSample[]

  // Personal Message
  coverLetter?: string
  relevantExperience?: string
  personalNote?: string
  proposedCost?: number

  // Client Review
  clientRating?: number
  clientFeedback?: string
  rejectionReason?: string

  // Interview/Next Steps
  interviewScheduled?: string
  interviewNotes?: string
  nextSteps?: string
}

// Application Status
export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'selected'
  | 'rejected'
  | 'withdrawn'

// Job Status
export type JobStatus =
  | 'draft'
  | 'published'
  | 'active'
  | 'paused'
  | 'closed'
  | 'completed'
  | 'cancelled'

// Client Dashboard Statistics
export interface ClientStats {
  totalJobs: number
  activeJobs: number
  completedJobs: number
  totalSpent: number
  monthlySpent: number
  averageJobValue: number
  totalApplications: number
  pendingApplications: number
  hiredTalents: number
  averageRating: number
  activeCampaigns: number
  recentActivity: ClientActivityItem[]
}

export interface ClientActivityItem {
  id: string
  type: 'job' | 'application' | 'invitation' | 'payment'
  title: string
  description: string
  timestamp: string
  status?: string
  url?: string
}

// Search and Filter Types
export interface TalentSearchFilters {
  languages?: string[]
  accents?: string[]
  voiceTypes?: VoiceType[]
  experience?: string[]
  location?: string
  availability?: string[]
  minRating?: number
  maxRate?: number
  isVerified?: boolean
  hasPortfolio?: boolean
}

export interface JobSearchFilters {
  status?: JobStatus[]
  projectType?: ProjectType[]
  languages?: string[]
  voiceTypes?: VoiceType[]
  budget?: {
    min?: number
    max?: number
  }
  deadline?: {
    from?: string
    to?: string
  }
}

// Re-export for external use
export type { VoiceType, ProjectType }
