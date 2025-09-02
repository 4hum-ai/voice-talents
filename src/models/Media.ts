import type { BaseEntity } from './BaseEntity'

// Media-specific types
export type MediaType =
  | 'dubbed'
  | 'trailer'
  | 'voice_over'
  | 'subtitle'
  | 'original'
  | 'behind_scenes'
  | 'interview'
  | 'promo'
  | 'recording'
  | 'mixing'
  | 'master'
  | 'poster'

export type MediaStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reviewed'
  | 'approved'
export type MediaFormat =
  | 'mp4'
  | 'avi'
  | 'mov'
  | 'mkv'
  | 'mp3'
  | 'wav'
  | 'aac'
  | 'flac'
  | 'srt'
  | 'vtt'
  | 'ass'
  | 'ssa'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'm3u8'

export interface Media extends BaseEntity {
  // Core identity
  fileName: string
  type: MediaType
  format: MediaFormat
  status: MediaStatus
  language?: string

  // Technical specifications
  fileSize?: number
  duration?: number // in seconds
  resolution?: string
  bitrate?: number
  frameRate?: number
  sampleRate?: number
  channels?: number

  // Metadata
  description?: string
  tags?: string[]
  thumbnailUrl?: string

  // Relationships
  titleId?: string
  organizationId?: string
}
