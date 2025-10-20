/**
 * VoiceAct - Voice Client Management App
 * TypeScript interfaces for voice client domain models
 */

import type { BaseEntity } from './models'
import type { VoiceType, ProjectType } from './voice-actor'

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
  jobType: 'open_casting' | 'invite_only' | 'urgent_fill' | 'targeted_search'
  projectType: ProjectType
  status: JobStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget: {
    min: number
    max: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
  }
  deadline: string
  startDate?: string
  estimatedDuration: string // e.g., "2-3 weeks", "1 month"
  requirements: {
    languages: string[]
    accents?: string[]
    voiceTypes: VoiceType[]
    ageRange?: string
    gender?: 'male' | 'female' | 'non-binary' | 'any'
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
    specialInstructions?: string
    quality: 'standard' | 'professional' | 'broadcast'
  }
  deliverables: JobDeliverable[]
  files: JobFile[]
  campaignId?: string
  isPublic: boolean
  applications: JobApplication[]
  selectedTalents: string[]
  totalApplications: number
  viewCount: number
  createdDate: string
  publishedDate?: string
  closedDate?: string
}

// Campaign - Different types of talent acquisition strategies
export interface Campaign extends BaseEntity {
  clientId: string
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  targetAudience: CampaignTarget
  budget: {
    total: number
    spent: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  }
  timeline: {
    startDate: string
    endDate: string
    duration: string
  }
  jobs: string[] // Job IDs
  invitations: TalentInvitation[]
  metrics: CampaignMetrics
  settings: CampaignSettings
  createdDate: string
  launchedDate?: string
  completedDate?: string
}

// Campaign Types
export type CampaignType =
  | 'fill_asap' // Open casting calls for immediate talent acquisition
  | 'invite_specific' // Targeted invitations to preferred voice actors
  | 'targeted_search' // Filter-based talent discovery
  | 'custom' // Flexible targeting with specific requirements

// Campaign Status
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'

// Campaign Target Audience
export interface CampaignTarget {
  languages: string[]
  accents?: string[]
  voiceTypes: VoiceType[]
  experience?: string[]
  location?: string[]
  availability?: string[]
  minRating?: number
  maxRate?: number
  isVerified?: boolean
  customCriteria?: string
}

// Campaign Metrics
export interface CampaignMetrics {
  totalViews: number
  totalApplications: number
  totalInvitations: number
  responseRate: number
  conversionRate: number
  averageResponseTime: number
  topPerformingJobs: string[]
  talentEngagement: {
    views: number
    applications: number
    shortlists: number
    hires: number
  }
}

// Campaign Settings
export interface CampaignSettings {
  autoApprove: boolean
  requirePortfolio: boolean
  requireCustomSample: boolean
  allowMultipleApplications: boolean
  notificationFrequency: 'immediate' | 'daily' | 'weekly'
  privacyLevel: 'public' | 'private' | 'invite_only'
  ndaRequired: boolean
  contractTemplate?: string
}

// Talent Invitation - Direct invitations to specific voice actors
export interface TalentInvitation extends BaseEntity {
  campaignId: string
  jobId: string
  clientId: string
  clientName: string
  voiceActorId: string
  voiceActorName: string
  status: InvitationStatus
  message?: string
  customOffer?: {
    rate: number
    currency: string
    timeline: string
    specialTerms?: string
  }
  sentDate: string
  respondedDate?: string
  expiresDate?: string
  response?: {
    status: 'accepted' | 'declined' | 'counter_offer'
    message?: string
    counterOffer?: {
      rate: number
      currency: string
      timeline: string
      specialTerms?: string
    }
  }
}

// Invitation Status
export type InvitationStatus =
  | 'sent'
  | 'delivered'
  | 'viewed'
  | 'responded'
  | 'expired'
  | 'cancelled'

// Job Application - Voice actor applications to job postings
export interface JobApplication extends BaseEntity {
  jobId: string
  voiceActorId: string
  voiceActorName: string
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

// Job Deliverable
export interface JobDeliverable extends BaseEntity {
  jobId: string
  title: string
  description: string
  type: 'final_audio' | 'raw_files' | 'processed_audio' | 'documentation'
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  dueDate: string
  completedDate?: string
  files: string[]
  notes?: string
}

// Job File
export interface JobFile extends BaseEntity {
  jobId: string
  title: string
  type: 'script' | 'reference' | 'contract' | 'other'
  fileUrl: string
  fileName: string
  fileSize?: number
  description?: string
  uploadedBy: string
  uploadedDate: string
  isPublic: boolean
}

// Custom Sample - Voice actor can create specific samples for a job
export interface CustomSample extends BaseEntity {
  applicationId: string
  title: string
  description?: string
  audioUrl: string
  duration: number
  fileSize: number
  format: 'mp3' | 'wav' | 'aac' | 'flac'
  isPublic: boolean
  tags: string[]
  metadata: {
    recordingQuality: 'standard' | 'professional' | 'broadcast'
    equipment?: string
    recordingLocation?: string
    dateRecorded?: string
  }
}

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
  type: 'job' | 'application' | 'campaign' | 'invitation' | 'payment'
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
  campaignType?: CampaignType[]
}

// Re-export for external use
export type { VoiceType, ProjectType }
