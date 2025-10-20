/**
 * VoiceAct - Voice Actor Management App
 * TypeScript interfaces for voice actor domain models
 */

import type { BaseEntity } from './models'

// Voice Actor Profile - Extended from base User
export interface VoiceActor extends BaseEntity {
  userId: string
  displayName: string
  bio: string
  avatarUrl?: string
  headshotUrl?: string
  languages: string[]
  accents: string[]
  voiceTypes: VoiceType[]
  skills: string[]
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  location: string
  timezone: string
  availability: 'available' | 'busy' | 'unavailable'
  hourlyRate?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  demoReelUrl?: string
  website?: string
  socialLinks: {
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  isVerified: boolean
  isPublic: boolean
  totalProjects: number
  completedProjects: number
  averageRating: number
  totalEarnings: number
  joinedDate: string
  lastActive: string
}

// Voice Sample - Categorized voice recordings
export interface VoiceSample extends BaseEntity {
  voiceActorId: string
  title: string
  description?: string
  audioUrl: string
  duration: number
  fileSize: number
  format: 'mp3' | 'wav' | 'aac' | 'flac'
  genre: VoiceGenre
  tone: VoiceTone
  language: string
  accent?: string
  voiceType: VoiceType
  tags: string[]
  isPublic: boolean
  isVerified: boolean // Studio-verified samples
  verifiedBy?: string // Studio ID that verified
  playCount: number
  downloadCount: number
  thumbnailUrl?: string
  waveformUrl?: string
  metadata: {
    recordingQuality: 'standard' | 'professional' | 'broadcast'
    equipment?: string
    recordingLocation?: string
    dateRecorded?: string
  }
}

// Project/Job Management
export interface Project extends BaseEntity {
  title: string
  description: string
  clientName: string
  studioId?: string
  studioName?: string
  projectType: ProjectType
  status: ProjectStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  deadline: string
  startDate?: string
  completedDate?: string
  assignedActors: ProjectAssignment[]
  deliverables: ProjectDeliverable[]
  communication: ProjectMessage[]
  requirements: {
    languages: string[]
    accents?: string[]
    voiceTypes: VoiceType[]
    duration?: number
    quality: 'standard' | 'professional' | 'broadcast'
    specialInstructions?: string
  }
  files: ProjectFile[]
  paymentStatus: 'pending' | 'partial' | 'completed' | 'overdue'
  totalPayment?: number
  paidAmount?: number
}

// Project Assignment - Links actors to projects
export interface ProjectAssignment extends BaseEntity {
  projectId: string
  voiceActorId: string
  voiceActorName: string
  role: string
  status: AssignmentStatus
  assignedDate: string
  dueDate: string
  completedDate?: string
  script?: string
  referenceMaterials: ReferenceMaterial[]
  recordings: Recording[]
  feedback: AssignmentFeedback[]
  payment?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
}

// Recording - Individual voice takes
export interface Recording extends BaseEntity {
  assignmentId: string
  projectId: string
  voiceActorId: string
  title: string
  audioUrl: string
  duration: number
  fileSize: number
  format: 'mp3' | 'wav' | 'aac' | 'flac'
  version: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revision_requested'
  submittedDate?: string
  approvedDate?: string
  notes?: string
  feedback?: string
  waveformUrl?: string
  metadata: {
    recordingQuality: 'standard' | 'professional' | 'broadcast'
    equipment?: string
    recordingLocation?: string
  }
}

// Studio Management
export interface Studio extends BaseEntity {
  name: string
  description: string
  logoUrl?: string
  website?: string
  location: string
  timezone: string
  contactEmail: string
  contactPhone?: string
  specialties: string[]
  languages: string[]
  isVerified: boolean
  totalProjects: number
  activeProjects: number
  averageRating: number
  members: StudioMember[]
  equipment: string[]
  services: string[]
  socialLinks: {
    website?: string
    linkedin?: string
    twitter?: string
  }
}

// Studio Member
export interface StudioMember extends BaseEntity {
  studioId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'producer' | 'engineer' | 'director' | 'manager'
  permissions: string[]
  joinedDate: string
  isActive: boolean
}

// Reference Materials
export interface ReferenceMaterial extends BaseEntity {
  assignmentId: string
  projectId: string
  title: string
  type: 'script' | 'video' | 'audio' | 'image' | 'document'
  fileUrl: string
  fileName: string
  fileSize?: number
  description?: string
  isRequired: boolean
  uploadedBy: string
  uploadedDate: string
}

// Project Files
export interface ProjectFile extends BaseEntity {
  projectId: string
  title: string
  type: 'script' | 'reference' | 'deliverable' | 'contract' | 'other'
  fileUrl: string
  fileName: string
  fileSize?: number
  description?: string
  uploadedBy: string
  uploadedDate: string
  isPublic: boolean
}

// Project Deliverable
export interface ProjectDeliverable extends BaseEntity {
  projectId: string
  assignmentId?: string
  title: string
  description: string
  type: 'final_audio' | 'raw_files' | 'processed_audio' | 'documentation'
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  dueDate: string
  completedDate?: string
  files: string[] // File URLs
  notes?: string
}

// Project Message
export interface ProjectMessage extends BaseEntity {
  projectId: string
  assignmentId?: string
  senderId: string
  senderName: string
  senderType: 'actor' | 'studio' | 'client'
  message: string
  messageType: 'text' | 'file' | 'system'
  attachments?: MessageAttachment[]
  isRead: boolean
  readBy: string[]
  replyTo?: string
}

// Message Attachment
export interface MessageAttachment extends BaseEntity {
  messageId: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
}

// Assignment Feedback
export interface AssignmentFeedback extends BaseEntity {
  assignmentId: string
  recordingId?: string
  fromUserId: string
  fromUserName: string
  fromUserType: 'studio' | 'client'
  feedback: string
  rating?: number
  timestamp: string
  isResolved: boolean
  replyTo?: string
}

// Notification
export interface Notification extends BaseEntity {
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  readDate?: string
  actionUrl?: string
  metadata: Record<string, unknown>
  priority: 'low' | 'medium' | 'high'
  expiresAt?: string
}

// Casting Session
export interface CastingSession extends BaseEntity {
  title: string
  description: string
  clientName: string
  studioId?: string
  projectType: ProjectType
  status: 'open' | 'closed' | 'completed'
  deadline: string
  requirements: {
    languages: string[]
    accents?: string[]
    voiceTypes: VoiceType[]
    ageRange?: string
    gender?: 'male' | 'female' | 'non-binary' | 'any'
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  }
  budget?: {
    min: number
    max: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  }
  proposals: CastingProposal[]
  submissions: CastingSubmission[] // Legacy - for backward compatibility
  selectedActors: string[]
  isPublic: boolean
  createdBy: string
  createdDate: string
}

// Casting Proposal - Enhanced submission with time, cost, and custom samples
export interface CastingProposal extends BaseEntity {
  castingSessionId: string
  voiceActorId: string
  voiceActorName: string
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'selected' | 'rejected'
  submittedDate: string
  reviewedDate?: string

  // Proposal Details
  proposedCost: number
  proposedCurrency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  proposedTimeline: string // e.g., "2-3 weeks", "1 month"
  estimatedHours: number

  // Custom Samples for this casting
  customSamples: CustomSample[]

  // Existing samples from portfolio
  portfolioSampleIds: string[]

  // Personal message to studio
  personalNote?: string

  // Studio feedback
  studioFeedback?: string
  rejectionReason?: string
}

// Custom Sample - Voice actor can create specific samples for a casting
export interface CustomSample extends BaseEntity {
  proposalId: string
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

// Casting Submission - Legacy interface for backward compatibility
export interface CastingSubmission extends BaseEntity {
  castingSessionId: string
  voiceActorId: string
  voiceActorName: string
  status: 'submitted' | 'reviewed' | 'shortlisted' | 'selected' | 'rejected'
  submittedDate: string
  reviewedDate?: string
  notes?: string
  sampleIds: string[]
  customMessage?: string
}

// Enums and Types
export type VoiceType =
  | 'narrator'
  | 'character'
  | 'announcer'
  | 'commercial'
  | 'audiobook'
  | 'podcast'
  | 'animation'
  | 'video_game'
  | 'documentary'
  | 'e-learning'
  | 'movie_dubbing'
  | 'film_narration'
  | 'movie_trailer'
  | 'documentary_voice'
  | 'film_character_dubbing'
  | 'movie_promotional'
  | 'film_commentary'
  | 'movie_teaser'
  | 'film_voice_match'
  | 'movie_redub'
  | 'film_loop_group'
  | 'movie_adr'
  | 'film_voice_direction'
  | 'movie_voice_casting'
  | 'film_voice_sync'

export type VoiceGenre =
  | 'commercial'
  | 'audiobook'
  | 'podcast'
  | 'animation'
  | 'video_game'
  | 'documentary'
  | 'e-learning'
  | 'radio'
  | 'television'
  | 'film'
  | 'theater'
  | 'presentation'
  | 'movie_dubbing'
  | 'film_narration'
  | 'movie_trailer'
  | 'documentary_voice'
  | 'film_character_dubbing'
  | 'movie_promotional'
  | 'film_commentary'
  | 'movie_teaser'
  | 'film_voice_match'
  | 'movie_redub'
  | 'film_loop_group'
  | 'movie_adr'
  | 'film_voice_direction'
  | 'movie_voice_casting'
  | 'film_voice_sync'

export type VoiceTone =
  | 'professional'
  | 'friendly'
  | 'authoritative'
  | 'warm'
  | 'energetic'
  | 'calm'
  | 'dramatic'
  | 'playful'
  | 'serious'
  | 'conversational'
  | 'mysterious'
  | 'inspiring'

export type ProjectType =
  | 'commercial'
  | 'audiobook'
  | 'podcast'
  | 'animation'
  | 'video_game'
  | 'documentary'
  | 'e-learning'
  | 'radio'
  | 'television'
  | 'film'
  | 'presentation'
  | 'phone_system'
  | 'app_voice'
  | 'movie_dubbing'
  | 'film_narration'
  | 'movie_trailer'
  | 'documentary_voice'
  | 'film_character_dubbing'
  | 'movie_promotional'
  | 'film_commentary'
  | 'movie_teaser'
  | 'film_voice_match'
  | 'movie_redub'
  | 'film_loop_group'
  | 'movie_adr'
  | 'film_voice_direction'
  | 'movie_voice_casting'
  | 'film_voice_sync'

export type ProjectStatus =
  | 'draft'
  | 'open'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'on_hold'

export type AssignmentStatus =
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'submitted'
  | 'review'
  | 'approved'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'

export type NotificationType =
  | 'project_assigned'
  | 'project_updated'
  | 'recording_submitted'
  | 'recording_approved'
  | 'recording_rejected'
  | 'payment_received'
  | 'message_received'
  | 'deadline_reminder'
  | 'casting_opportunity'
  | 'system_announcement'

// Dashboard Statistics
export interface VoiceActorStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalEarnings: number
  monthlyEarnings: number
  averageRating: number
  totalSamples: number
  publicSamples: number
  pendingAssignments: number
  overdueAssignments: number
  upcomingDeadlines: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'project' | 'assignment' | 'recording' | 'payment' | 'message'
  title: string
  description: string
  timestamp: string
  status?: string
  url?: string
}

// Search and Filter Types
export interface VoiceActorSearchFilters {
  languages?: string[]
  accents?: string[]
  voiceTypes?: VoiceType[]
  experience?: string[]
  location?: string
  availability?: string[]
  minRating?: number
  maxRate?: number
  isVerified?: boolean
}

export interface ProjectSearchFilters {
  status?: ProjectStatus[]
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
