/**
 * Event handler and interaction interfaces
 */

import type { Media } from './models'

// Event constants
export const EVENT_CRUD = 'crud'
export const EVENT_ACTIVITIES_UPDATED = 'activities_updated'
export const EVENT_VISITS_UPDATED = 'visits_updated'
export const EVENT_HTTP_ACTIVE = 'http_active'
export const EVENT_HTTP_ERROR = 'http_error'

// Event payload interfaces
export interface CrudEventPayload {
  action: 'create' | 'update' | 'delete'
  resource: string
  id?: string
  data?: unknown
  at?: string
  beforeData?: unknown
  afterData?: unknown
}

export interface HttpActivePayload {
  active: boolean | number
  url?: string
  method?: string
}

export interface HttpErrorPayload {
  error: string
  url?: string
  method?: string
  status?: number
  path?: string
  message?: string
}

export interface Recording {
  name: string
  url: string
}

export interface AudioPlaybackEvent {
  recording?: Recording
  event?: MouseEvent
}

export interface FormUpdateEvent<T = unknown> {
  (value: T): void
}

export interface MediaPlaybackEvent {
  media: Media
  event?: MouseEvent
}
