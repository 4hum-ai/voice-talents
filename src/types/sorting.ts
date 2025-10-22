/**
 * Generic sorting and comparison interfaces
 */

export interface SortableValue {
  value: unknown
  type: 'string' | 'number' | 'date' | 'boolean'
}

export interface SortFunction<T = unknown> {
  (a: T, b: T, field: string, direction: 'asc' | 'desc'): number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}
