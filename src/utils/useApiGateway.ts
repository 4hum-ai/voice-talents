import { getAuth } from "firebase/auth";
import { useEventBus } from "@vueuse/core";
import {
  EVENT_HTTP_ACTIVE,
  EVENT_HTTP_ERROR,
  type HttpActivePayload,
  type HttpErrorPayload,
} from "@/types/events";

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
  const activeBus = useEventBus<HttpActivePayload>(EVENT_HTTP_ACTIVE);
  const errorBus = useEventBus<HttpErrorPayload>(EVENT_HTTP_ERROR);
  let activeRequests = 0;

  const request = async (
    path: string,
    opts: RequestOptions = {},
  ): Promise<Response> => {
    const url = joinUrl(baseUrl, path);
    const authHeader = await buildAuthHeader();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...authHeader,
      ...(opts.headers as Record<string, string> | undefined),
    };

    // Prefer caller-provided AbortSignal. If none, optionally create a timeout-based signal.
    const computedSignal = opts.signal
      ? opts.signal
      : typeof AbortSignal !== "undefined" && (AbortSignal as any).timeout
        ? (opts.timeoutMs ?? timeoutMs)
          ? (AbortSignal as any).timeout(opts.timeoutMs ?? timeoutMs)
          : undefined
        : undefined;

    let response: Response;
    // mark start
    activeRequests += 1;
    activeBus.emit({ active: activeRequests });
    try {
      response = await fetch(url, { ...opts, headers, signal: computedSignal });
    } catch (error: any) {
      // Suppress toasts for intentional aborts
      if (error?.name !== "AbortError") {
        errorBus.emit({
          method: String(opts.method ?? "GET"),
          path,
          message: String(error?.message ?? "Request failed"),
        });
      }
      throw error;
    } finally {
      // mark end
      activeRequests = Math.max(0, activeRequests - 1);
      activeBus.emit({ active: activeRequests });
    }

    if (response.status === 401) {
      try {
        const refreshed = await getAuth().currentUser?.getIdToken(true);
        if (refreshed) {
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshed}`,
          };
          // mark start for retry
          activeRequests += 1;
          activeBus.emit({ active: activeRequests });
          try {
            response = await fetch(url, {
              ...opts,
              headers: retryHeaders,
              signal: computedSignal,
            });
          } finally {
            activeRequests = Math.max(0, activeRequests - 1);
            activeBus.emit({ active: activeRequests });
          }
        }
      } catch (_) {
        // Token refresh failed; return original unauthorized response
      }
    }

    // Do not toast for HTTP error statuses here; let callers decide contextually.

    return response;
  };

  return { request, baseUrl };
}

let singletonClient: ApiClient | null = null;

export function useApiGateway(base: string = "movie"): ApiClient {
  if (singletonClient) return singletonClient;
  const API_BASE = (import.meta as any).env?.VITE_PUBLIC_API_URL as
    | string
    | undefined;
  let baseUrl = "";
  if (API_BASE && /^https?:\/\//i.test(API_BASE)) {
    const root = API_BASE.replace(/\/$/, "");
    baseUrl = `${root}/${base}`;
  }
  singletonClient = createApiClient({ baseUrl });
  return singletonClient;
}
