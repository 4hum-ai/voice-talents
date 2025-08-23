import { getAuth } from "firebase/auth";

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

    let response = await fetch(url, { ...opts, headers, ...controller });

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

    return response;
  };

  return { request };
}

