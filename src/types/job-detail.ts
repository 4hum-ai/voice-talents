/**
 * Shared job detail interface for client and talent job detail views
 * Extends JobPosting with additional fields needed for detail views
 */

import type { JobPosting } from './voice-client'

// Project files from job creation modal
export interface ProjectFiles {
  script?: {
    name: string
    size: number
    type: string
    url?: string
  }
  referenceAudio?: {
    name: string
    size: number
    type: string
    url?: string
  }
  additional?: Array<{
    name: string
    size: number
    type: string
    url?: string
  }>
}

// Extended job interface for detail views
export interface JobDetail extends JobPosting {
  // Progress tracking
  progress: number
  
  // Voice requirements (from job creation modal)
  voiceStyle?: string
  pace?: string
  tone?: string
  duration?: string
  recordingQuality?: string
  
  // Project files from job creation
  projectFiles?: ProjectFiles
  
  // Client notes and requirements
  clientNotes?: string[]
  
  // Talent information (when assigned)
  talentName?: string
  talentExperience?: string
  talentLanguages?: string
  talentRating?: string
  
  // Talent notes and communication
  talentNotes?: string[]
  
  // Deliverables and submissions
  finalAudio?: {
    name: string
    duration: string
    size: string
    submittedAt: string
    url?: string
  }
  
  // Script segments (for talent view)
  scriptSegments?: ScriptSegment[]
  
  // Additional metadata
  createdAt: string
  updatedAt: string
}

// Script segment for talent recording workflow
export interface ScriptSegment {
  text: string
  startTime: string
  duration: string
  hasTTS: boolean
  hasRecording: boolean
  hasAudio: boolean
  isSelected: boolean
}

// Job status mapping for UI components
export type JobStatusDisplay = 
  | 'draft'
  | 'active' 
  | 'pending'
  | 'completed'
  | 'cancelled'

// Progress status for progress indicators
export type ProgressStatus = 
  | 'draft'
  | 'pending'
  | 'active'
  | 'success'
  | 'completed'

// Progress variant for styling
export type ProgressVariant = 
  | 'soft'
  | 'solid'

// Helper function to map job status to display status
export const getJobStatusDisplay = (status: string): JobStatusDisplay => {
  switch (status) {
    case 'draft':
      return 'draft'
    case 'published':
    case 'active':
      return 'active'
    case 'paused':
    case 'under_review':
      return 'pending'
    case 'completed':
      return 'completed'
    case 'cancelled':
    case 'closed':
      return 'cancelled'
    default:
      return 'draft'
  }
}

// Helper function to get progress status
export const getProgressStatus = (progress: number): ProgressStatus => {
  if (progress === 100) return 'completed'
  if (progress >= 75) return 'success'
  if (progress >= 50) return 'active'
  if (progress >= 25) return 'pending'
  return 'draft'
}

// Helper function to get progress variant
export const getProgressVariant = (progress: number): ProgressVariant => {
  if (progress === 100) return 'solid'
  return 'soft'
}

// Helper function to format project type
export const formatProjectType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
