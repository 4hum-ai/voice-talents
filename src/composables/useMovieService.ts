import { useApiGateway } from './useApiGateway'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface AdminModuleInfo {
  name: string
  displayName: string
  description?: string
  icon?: string
  path: string
}

export class ConnectionError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'ConnectionError'
  }
}

// Module-level singletons (persist across composable calls, per tab)
const singletonUiConfig = new Map<string, any>()
const singletonAdminModules: { data: AdminModuleInfo[] | null } = { data: null }

export function useMovieService() {
  const client = useApiGateway()

  const checkConnection = async (): Promise<boolean> => {
    try {
      const base = (client as any).baseUrl as string | undefined
      const response = await fetch(`${base}/health`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(5000) : undefined
      })
      return response.ok
    } catch {
      return false
    }
  }

  const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const res = await client.request(endpoint, options)
      if (!res.ok) {
        let message = `HTTP error! status: ${res.status}`
        const contentType = res.headers.get('content-type') || ''
        if (/application\/json/.test(contentType)) {
          try {
            const err = await res.json()
            message = err.message || err.error || message
          } catch {
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

  const get = <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
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
    return request<T>(path)
  }

  const post = <T>(endpoint: string, data?: any): Promise<T> => request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined })
  const put = <T>(endpoint: string, data?: any): Promise<T> => request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined })
  const del = <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' })

  const listModuleItems = async (module: string, params?: Record<string, any>): Promise<PaginatedResponse<any>> => {
    const payload = await get<any>(`/api/${module}`, params)
    const pg = payload?.pagination ?? {}
    const page = Number(pg.page ?? payload.page ?? 1) || 1
    const limit = Number(pg.limit ?? payload.limit ?? 20) || 20
    const total = Number(pg.total ?? payload.total ?? 0) || 0
    const totalPages = Number(pg.totalPages ?? payload.totalPages ?? Math.ceil(total / (limit || 1))) || Math.max(1, Math.ceil(total / (limit || 1)))
    return {
      data: payload.data || [],
      pagination: { page, limit, total, totalPages }
    }
  }

  const getModuleUiConfig = async (module: string, opts?: { force?: boolean }): Promise<any | null> => {
    if (!opts?.force && singletonUiConfig.has(module)) {
      return singletonUiConfig.get(module)
    }
    try {
      const data = await get<any>(`/api/admin-ui/modules/${module}/config`)
      singletonUiConfig.set(module, data)
      return data
    } catch (_) {
      // stale-on-error
      return singletonUiConfig.get(module) ?? null
    }
  }

  const listAdminModules = async (opts?: { force?: boolean }): Promise<AdminModuleInfo[]> => {
    if (!opts?.force && singletonAdminModules.data) {
      return singletonAdminModules.data
    }
    try {
      const payload = await get<{ modules?: AdminModuleInfo[] }>(`/api/admin-ui/modules`)
      const modules = Array.isArray(payload?.modules) ? payload.modules : []
      singletonAdminModules.data = modules
      return modules
    } catch (_) {
      // stale-on-error
      return singletonAdminModules.data ?? []
    }
  }

  const createModuleItem = async (module: string, data: any): Promise<any> => (await post<any>(`/api/${module}`, data)).data
  const updateModuleItem = async (module: string, id: string, data: any): Promise<any> => (await put<any>(`/api/${module}/${id}`, data)).data
  const deleteModuleItem = async (module: string, id: string): Promise<void> => { await del<void>(`/api/${module}/${id}`) }

  return {
    checkConnection,
    listAdminModules,
    listModuleItems,
    getModuleUiConfig,
    createModuleItem,
    updateModuleItem,
    deleteModuleItem
  }
}


