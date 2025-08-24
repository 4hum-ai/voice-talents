import { shallowRef } from 'vue'
import { createApiClient, type ApiClient } from '@/utils/apiGateway'

const clientRef = shallowRef<ApiClient | null>(null)

export function useApiGateway(): ApiClient {
  if (clientRef.value) return clientRef.value
  const RAW_API_BASE = (import.meta as any).env?.VITE_PUBLIC_API_URL as string | undefined
  const base = RAW_API_BASE && /^https?:\/\//i.test(RAW_API_BASE) ? `${RAW_API_BASE.replace(/\/$/, '')}/movie` : ''
  const client = createApiClient({ baseUrl: base })
  clientRef.value = client
  return client
}


