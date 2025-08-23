// Movie Service API client for Admin low-code views
import { createApiClient } from '@/utils/apiGateway'
export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const RAW_API_BASE = (import.meta as any).env?.VITE_PUBLIC_API_URL as string | undefined
const API_BASE_URL = RAW_API_BASE && /^https?:\/\//i.test(RAW_API_BASE)
  ? `${RAW_API_BASE.replace(/\/$/, '')}/movie`
  : ''

export class ConnectionError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'ConnectionError'
  }
}

class MovieApiService {
  private client
  constructor(private baseUrl: string) {
    this.client = createApiClient({ baseUrl })
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(5000) : undefined
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.baseUrl) {
      throw new ConnectionError(
        'API base URL is not configured. Set VITE_PUBLIC_API_URL in apps/admin/.env to your API Gateway base URL (e.g., https://<gateway-domain>)'
      )
    }
    // using shared api gateway client under the hood
    try {
      const res = await this.client.request(endpoint, options)
      if (!res.ok) {
        let message = `HTTP error! status: ${res.status}`
        const contentType = res.headers.get('content-type') || ''
        if (/application\/json/.test(contentType)) {
          try {
            const err = await res.json()
            message = err.message || err.error || message
          } catch {
            // Non-JSON error body; keep default message
            void 0
          }
        } else {
          const text = await res.text().catch(() => '')
          if (text?.startsWith('<!doctype') || text?.startsWith('<!DOCTYPE')) {
            message = 'Received HTML from server. Check VITE_PUBLIC_API_URL; the dev server likely returned index.html for a bad URL.'
          }
        }
        throw new Error(message)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!/application\/json/.test(contentType)) {
        const text = await res.text().catch(() => '')
        throw new Error('Server returned non-JSON response. Verify API base URL and endpoint. Sample: ' + text.slice(0, 120))
      }
      return await res.json()
    } catch (error: any) {
      if (error?.name === 'AbortError' || /Failed to fetch|NetworkError/.test(String(error))) {
        throw new ConnectionError('Unable to reach Movie Service. Check connectivity and URL.', error)
      }
      throw error
    }
  }

  private get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const search = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (typeof v === 'object' && !Array.isArray(v)) {
          Object.entries(v).forEach(([nk, nv]) => nv !== undefined && nv !== null && search.append(nk, String(nv)))
        } else {
          search.append(k, String(v))
        }
      })
    }
    const q = search.toString()
    const path = q ? `${endpoint}?${q}` : endpoint
    return this.request<T>(path)
  }

  private post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined })
  }
  private put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined })
  }
  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async listModuleItems(module: string, params?: Record<string, any>): Promise<PaginatedResponse<any>> {
    const payload = await this.get<any>(`/api/${module}`, params)
    const pg = payload?.pagination ?? {}
    const page = Number(pg.page ?? payload.page ?? 1) || 1
    const limit = Number(pg.limit ?? payload.limit ?? 20) || 20
    const total = Number(pg.total ?? payload.total ?? 0) || 0
    const totalPages = Number(pg.totalPages ?? payload.totalPages ?? Math.ceil(total / (limit || 1))) || Math.max(1, Math.ceil(total / (limit || 1)))
    return {
      data: payload.data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }
  async getModuleUiConfig(module: string): Promise<any | null> {
    try {
      return await this.get<any>(`/api/admin-ui/modules/${module}/config`)
    } catch (_) {
      return null
    }
  }
  async createModuleItem(module: string, data: any): Promise<any> {
    const res = await this.post<any>(`/api/${module}`, data)
    return res.data
  }
  async updateModuleItem(module: string, id: string, data: any): Promise<any> {
    const res = await this.put<any>(`/api/${module}/${id}`, data)
    return res.data
  }
  async deleteModuleItem(module: string, id: string): Promise<void> {
    await this.delete<void>(`/api/${module}/${id}`)
  }
}

export const movieApi = new MovieApiService(API_BASE_URL)



