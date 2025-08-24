import { getAuth } from "firebase/auth";
import { useToast } from "@/composables/useToast";

export interface ApiClientOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export interface ApiClient {
  request: (path: string, options?: RequestOptions) => Promise<Response>;
  baseUrl: string;
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

async function buildAuthHeader(): Promise<Record<string, string>> {
  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    const token = await firebaseUser?.getIdToken();
    if (token) return { Authorization: `Bearer ${token}` };
  } catch (_) {
    // Ignore auth header build failures; proceed without auth
  }
  return {};
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const { baseUrl, defaultHeaders = {}, timeoutMs } = options;

  const request = async (path: string, opts: RequestOptions = {}): Promise<Response> => {
    const url = joinUrl(baseUrl, path);
    const authHeader = await buildAuthHeader();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...authHeader,
      ...(opts.headers as Record<string, string> | undefined),
    };

    const controller = typeof AbortSignal !== "undefined" && (AbortSignal as any).timeout
      ? { signal: (opts.timeoutMs ?? timeoutMs) ? (AbortSignal as any).timeout(opts.timeoutMs ?? timeoutMs) : undefined }
      : {};

    const { push } = useToast();

    let response: Response;
    try {
      response = await fetch(url, { ...opts, headers, ...controller });
    } catch (error: any) {
      push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "error",
        position: "tr",
        title: "Network error",
        body: `${opts.method ?? "GET"} ${path}: ${error?.message ?? "Request failed"}`,
        timeout: 6000,
      });
      throw error;
    }

    if (response.status === 401) {
      try {
        const refreshed = await getAuth().currentUser?.getIdToken(true);
        if (refreshed) {
          const retryHeaders = { ...headers, Authorization: `Bearer ${refreshed}` };
          response = await fetch(url, { ...opts, headers: retryHeaders, ...controller });
        }
      } catch (_) {
        // Token refresh failed; return original unauthorized response
      }
    }

    if (!response.ok) {
      push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "error",
        position: "tr",
        title: `Request failed (${response.status})`,
        body: `${opts.method ?? "GET"} ${path}: ${response.statusText || "Unexpected error"}`,
        timeout: 6000,
      });
    }

    return response;
  };

  return { request, baseUrl };
}

let singletonClient: ApiClient | null = null;

export function useApiGateway(): ApiClient {
  if (singletonClient) return singletonClient;
  const RAW_API_BASE = (import.meta as any).env?.VITE_PUBLIC_API_URL as string | undefined;
  const base = RAW_API_BASE && /^https?:\/\//i.test(RAW_API_BASE) ? `${RAW_API_BASE.replace(/\/$/, '')}/movie` : '';
  singletonClient = createApiClient({ baseUrl: base });
  return singletonClient;
}


