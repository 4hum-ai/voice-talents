import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createApiClient } from "../../src/utils/useApiGateway";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: {
      getIdToken: vi.fn(async () => undefined),
    },
  })),
}));

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({
    push: vi.fn(),
  }),
}));

declare global {
   
  var fetch: any;
}

describe("useApiGateway / createApiClient", () => {
  const originalFetch = globalThis.fetch;
  const originalAbortSignal: any = (globalThis as any).AbortSignal;

  beforeEach(() => {
    vi.useRealTimers();
    // Basic polyfill for AbortSignal.timeout if missing
    if (!originalAbortSignal || !(originalAbortSignal as any).timeout) {
      class AbortSignalPolyfill extends AbortSignal {}
      (AbortSignalPolyfill as any).timeout = (ms: number) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ms);
        return controller.signal;
      };
      (globalThis as any).AbortSignal = AbortSignalPolyfill as any;
    }
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    (globalThis as any).AbortSignal = originalAbortSignal;
    vi.restoreAllMocks();
  });

  it("joins URLs correctly and includes headers with token when available", async () => {
    const { getAuth } = await import("firebase/auth");
    (getAuth as any).mockReturnValue({
      currentUser: {
        getIdToken: vi.fn(async () => "test-token"),
      },
    });

    const fetchSpy = vi.fn(async () => new Response(null, { status: 200 }));
    globalThis.fetch = fetchSpy as any;

    const api = createApiClient({
      baseUrl: "https://api.example.com/",
      defaultHeaders: { "X-App": "admin" },
    });
    await api.request("/health", { method: "GET" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchSpy.mock.calls[0]!;
    expect(calledUrl).toBe("https://api.example.com/health");
    expect(
      (calledInit.headers as Record<string, string>)["Authorization"],
    ).toBe("Bearer test-token");
    expect((calledInit.headers as Record<string, string>)["X-App"]).toBe(
      "admin",
    );
  });

  it("retries once on 401 with refreshed token", async () => {
    const { getAuth } = await import("firebase/auth");
    const getIdToken = vi
      .fn()
      .mockResolvedValueOnce("old-token")
      .mockResolvedValueOnce("new-token");
    // For forced refresh path
    const getIdTokenForce = vi.fn(async () => "new-token");
    (getAuth as any).mockReturnValue({
      currentUser: {
        getIdToken,
      },
    });
    (getAuth as any).mockImplementationOnce(() => ({
      currentUser: { getIdToken: getIdTokenForce },
    }));

    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    globalThis.fetch = fetchSpy as any;

    const api = createApiClient({ baseUrl: "https://api.example.com" });
    const res = await api.request("/secure");

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("respects provided AbortSignal and does not override it", async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSpy = vi.fn(async () => new Response(null, { status: 200 }));
    globalThis.fetch = fetchSpy as any;

    const api = createApiClient({
      baseUrl: "https://api.example.com",
      timeoutMs: 25,
    });
    await api.request("/data", { signal });

    const calledInit = fetchSpy.mock.calls[0]![1];
    expect(calledInit.signal).toBe(signal);
  });

  it("builds base from import.meta env in useApiGateway", async () => {
    vi.resetModules();
    const mod = await import("../../src/utils/useApiGateway");
    const client = mod.useApiGateway();
    const env: any = (import.meta as any).env || {};
    const raw = env.VITE_PUBLIC_API_URL as string | undefined;
    let expected = "";
    if (raw && /^https?:\/\//i.test(raw)) {
      const root = raw.replace(/\/$/, "");
      const rawPath = env.VITE_API_BASE_PATH as string | undefined;
      const suffix = rawPath
        ? `/${rawPath.replace(/^\//, "").replace(/\/$/, "")}`
        : "/movie";
      expected = `${root}${suffix}`;
    }
    expect(client.baseUrl).toBe(expected);
  });
});
