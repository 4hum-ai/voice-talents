/**
 * Media Library Types
 */

export interface MediaItem {
  /** Unique identifier */
  id: string
  /** Media type (e.g., 'video', 'audio', 'image') */
  type: string
  /** File format (e.g., 'mp4', 'png', 'mp3') */
  format: string
  /** URL to access the media file */
  fileUrl: string
  /** Original filename */
  fileName: string
  /** File size in bytes (optional) */
  fileSize?: number
  /** Duration in seconds for audio/video (optional) */
  duration?: number
  /** MIME content type */
  contentType: string
  /** Processing status (optional) */
  status?: string
  /** Language code (optional) */
  language?: string
  /** Upload URL for direct uploads (optional) */
  uploadUrl?: string
  /** Upload URL expiration timestamp (optional) */
  uploadExpiresAt?: string | Date
  /** Storage bucket name (optional) */
  bucket?: string
  /** Storage path (optional) */
  path?: string
}

export interface PaginatedResponse<T> {
  /** Array of media items */
  data: T[]
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number
    /** Number of items per page */
    limit: number
    /** Total number of items */
    total: number
    /** Total number of pages */
    totalPages: number
  }
}
