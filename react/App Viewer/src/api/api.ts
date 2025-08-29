// src/api/api.ts
import type {
    ApiEnvelope,
    Page,
    SimplePageData,
    CommonFilters,
    CommonSearchRequest,
    PhotoFile,
} from "../types/common";
import { toSimplePageData } from "../types/common";

/* -----------------------------------------------------------
 * 0) API Base Prefixes (generic)
 * ---------------------------------------------------------*/
export const API_BASE: string =
    import.meta.env.MODE === "development" ? "" : import.meta.env.VITE_API_BASE;

export const AUX_API_BASE: string =
    import.meta.env.MODE === "development" ? "" : import.meta.env.VITE_AUX_API_BASE;

/* -----------------------------------------------------------
 * Internal: mock.json loader & helpers (dev fallback)
 * ---------------------------------------------------------*/
type MockShape = Record<string, unknown>;

function getBaseUrl(): string {
    try {
        // Vite의 베이스 경로 (ex. "/myapp/")
        return (import.meta as { env?: Record<string, string> })?.env?.BASE_URL || "/";
    } catch {
        return "/";
    }
}

/** 전달된 url(절대/상대)을 pathname으로 정규화하고, API_BASE prefix를 제거 */
function pathnameOf(url: string): string {
    try {
        const u = new URL(url, window.location.origin);
        const path = u.pathname;
        if (API_BASE && path.startsWith(API_BASE)) {
            const cut = path.slice(API_BASE.length);
            return cut.startsWith("/") ? cut : `/${cut}`;
        }
        return path;
    } catch {
        return url.startsWith("http") ? "/" : url;
    }
}

/** public/mock.json 읽기 (여러 경로 후보를 시도, HTML 응답은 무시) */
async function loadMock(): Promise<MockShape> {
    const base = getBaseUrl();
    const candidates = [
        `${base.replace(/\/?$/, "/")}mock.json`,
        "/mock.json",
        "mock.json",
    ];

    let lastErr: unknown;
    for (const url of candidates) {
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) continue;

            const ct = res.headers.get("content-type") || "";
            const text = await res.text();

            // JSON이 아닌 (대개 index.html) 응답이면 건너뛰기
            if (!ct.includes("json") && /^\s*</.test(text)) continue;

            return JSON.parse(text) as MockShape;
        } catch (e) {
            lastErr = e;
            continue;
        }
    }
    throw new Error(`mock.json not found or not JSON. last error: ${String(lastErr)}`);
}

/* -----------------------------------------------------------
 * 1) Low-level fetch helpers
 * ---------------------------------------------------------*/
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { method: "GET", ...init });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch error: ${res.status} ${text}`);
    }
    return (await res.json()) as T;
}

export async function fetchText(url: string, init?: RequestInit): Promise<string> {
    const res = await fetch(url, { method: "GET", ...init });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch error: ${res.status} ${text}`);
    }
    return await res.text();
}

export async function postJson<T>(
    url: string,
    body: unknown,
    extraInit?: RequestInit
): Promise<T> {
    return fetchJson<T>(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(extraInit?.headers || {}) },
        body: JSON.stringify(body),
        ...extraInit,
    });
}

export async function patchJson<T>(
    url: string,
    body: unknown,
    extraInit?: RequestInit
): Promise<T> {
    return fetchJson<T>(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(extraInit?.headers || {}) },
        body: JSON.stringify(body),
        ...extraInit,
    });
}

/* -----------------------------------------------------------
 * 2) Page helpers (common.ts와 연동)
 * ---------------------------------------------------------*/
export function createEmptyPage<T>(): Page<T> {
    return {
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            offset: 0,
            paged: false,
            unpaged: true,
        },
        totalElements: 0,
        totalPages: 0,
        last: true,
        size: 0,
        number: 0,
        sort: { sorted: false, empty: true, unsorted: true },
        numberOfElements: 0,
        first: true,
        empty: true,
    };
}

export function buildUrl(
    base: string,
    params: Record<string, string | number | boolean | undefined>
): string {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        usp.set(k, String(v));
    });
    const qs = usp.toString();
    return qs ? `${base}?${qs}` : base;
}

/** CommonFilters → querystring key 매핑 */
export function mapCommonFiltersToQuery(filters: CommonFilters = {}, keyword?: string) {
    const q: Record<string, string> = {};

    if (keyword && keyword.trim()) q["q"] = keyword.trim();
    if (filters.q && filters.q.trim()) q["q"] = filters.q.trim();

    if (filters.ids?.length) q["ids"] = filters.ids.join(",");

    if (typeof filters.status === "string") q["status"] = filters.status;
    if (Array.isArray(filters.status) && filters.status.length)
        q["status"] = filters.status.join(",");
    if (filters.tags?.length) q["tags"] = filters.tags.join(",");

    if (filters.name) q["name"] = filters.name;
    if (filters.email) q["email"] = filters.email;
    if (filters.phone) q["phone"] = filters.phone;

    if (typeof filters.active === "boolean") q["active"] = String(filters.active);
    if (typeof filters.archived === "boolean") q["archived"] = String(filters.archived);

    if (filters.created?.from) q["createdFrom"] = filters.created.from;
    if (filters.created?.to) q["createdTo"] = filters.created.to;
    if (filters.updated?.from) q["updatedFrom"] = filters.updated.from;
    if (filters.updated?.to) q["updatedTo"] = filters.updated.to;
    if (filters.date?.from) q["dateFrom"] = filters.date.from;
    if (filters.date?.to) q["dateTo"] = filters.date.to;

    if (filters.number?.min !== undefined) q["numberMin"] = String(filters.number.min);
    if (filters.number?.max !== undefined) q["numberMax"] = String(filters.number.max);
    if (filters.amount?.min !== undefined) q["amountMin"] = String(filters.amount.min);
    if (filters.amount?.max !== undefined) q["amountMax"] = String(filters.amount.max);

    return q;
}

/** GET 페이징 목록 호출 (실패 시 mock.json 폴백) */
export async function fetchPaged<T>(
    baseUrl: string,
    req: CommonSearchRequest = {},
    extraQuery?: Record<string, string | number | boolean | undefined>
): Promise<Page<T>> {
    const {
        page = 0,
        size = 20,
        sortBy = "createdAt",
        direction = "desc",
        ...filters
    } = req;

    const query = {
        page,
        size,
        sortby: sortBy,
        sortdirection: direction,
        ...mapCommonFiltersToQuery(filters as CommonFilters, (filters as CommonFilters).q),
        ...(extraQuery ?? {}),
    };

    const url = buildUrl(baseUrl, query);
    try {
        return await fetchJson<Page<T>>(url);
    } catch (err) {
        console.error("fetchPaged failed:", err);

        try {
            const mock = await loadMock();
            const key = pathnameOf(baseUrl);
            const data = mock[key] as Page<T> | undefined;
            return data ?? createEmptyPage<T>();
        } catch (e) {
            console.error("mock.json load failed:", e);
            return createEmptyPage<T>();
        }
    }
}

/** Page<T> → SimplePageData<T>로 축약해서 받고 싶을 때 */
export async function fetchPagedSimple<T>(
    baseUrl: string,
    req: CommonSearchRequest = {},
    extraQuery?: Record<string, string | number | boolean | undefined>
): Promise<SimplePageData<T>> {
    const page = await fetchPaged<T>(baseUrl, req, extraQuery);
    return toSimplePageData(page);
}

/* -----------------------------------------------------------
 * 3) Generic item/envelope helpers
 * ---------------------------------------------------------*/
export async function fetchItem<T>(url: string): Promise<T | null> {
    try {
        return await fetchJson<T>(url);
    } catch (e) {
        console.error("fetchItem failed:", e);

        try {
            const mock = await loadMock();
            const key = pathnameOf(url);
            return (mock[key] as T) ?? null;
        } catch (err) {
            console.error("mock.json load failed:", err);
            return null;
        }
    }
}

export async function fetchEnvelopeData<T>(url: string): Promise<T | null> {
    try {
        const json = await fetchJson<ApiEnvelope<T>>(url);
        return json?.data ?? null;
    } catch (e) {
        console.error("fetchEnvelopeData failed:", e);

        try {
            const mock = await loadMock();
            const key = pathnameOf(url);
            const entry = mock[key] as ApiEnvelope<T> | undefined;
            return entry?.data ?? null;
        } catch (err) {
            console.error("mock.json load failed:", err);
            return null;
        }
    }
}

/* -----------------------------------------------------------
 * 4) URL by hash (generic resolver)
 * ---------------------------------------------------------*/
export type HashResolveOptions = {
    apiBase?: string;       // default: API_BASE
    resolverPath?: string;  // default: "/api/url"
    paramName?: string;     // default: "hash"
};

export async function resolveUrlByHash(
    hash: string,
    opts: HashResolveOptions = {}
): Promise<string> {
    const { apiBase = API_BASE, resolverPath = "/api/url", paramName = "hash" } = opts;

    const url = buildUrl(`${apiBase}${resolverPath}`, { [paramName]: hash });
    try {
        const raw: unknown = await fetchJson<unknown>(url);

        if (typeof raw === "string") return raw.trim();
        if (typeof (raw as ApiEnvelope<string>)?.data === "string")
            return (raw as ApiEnvelope<string>).data.trim();
        if (typeof (raw as { url?: string })?.url === "string")
            return (raw as { url: string }).url.trim();

        const parsed = String(raw ?? "").trim();
        if (parsed) return parsed;

        throw new Error("resolveUrlByHash: No URL in response");
    } catch (e) {
        console.error("resolveUrlByHash failed:", e);

        try {
            const mock = await loadMock();
            const mapping = (mock["/api/url"] as { dataMap?: Record<string, string> } | undefined)
                ?.dataMap;
            const hit = mapping?.[hash];
            return typeof hit === "string" ? hit : "";
        } catch (err) {
            console.error("mock.json load failed:", err);
            return "";
        }
    }
}

/** 단일 해시 → PhotoFile (filename 추출 포함) */
export async function fetchFileByHash(
    hash: string,
    opts: HashResolveOptions = {}
): Promise<PhotoFile[]> {
    try {
        const link = await resolveUrlByHash(hash, opts);
        if (!link) return [];
        const filename = link.split("/").pop() || "file_0";
        return [{ id: 0, externalPath: link, filename }];
    } catch (e) {
        console.error("fetchFileByHash failed:", e);
        return [];
    }
}

/** 복수 해시 → PhotoFile[] */
export async function fetchFilesByHashes(
    hashes: string[],
    opts: HashResolveOptions = {}
): Promise<PhotoFile[]> {
    if (!hashes?.length) return [];
    const tasks = hashes.map(async (h) => {
        try {
            const link = await resolveUrlByHash(h, opts);
            const filename = link.split("/").pop() || h;
            return { id: 0, externalPath: link, filename } as PhotoFile;
        } catch (e) {
            console.error("resolve failed:", h, e);
            return null;
        }
    });
    const settled = await Promise.all(tasks);
    return settled.filter((x): x is PhotoFile => !!x);
}

/* -----------------------------------------------------------
 * 5) Upload & Download (generic)
 * ---------------------------------------------------------*/
/** 파일 업로드 */
export async function uploadFile(options: {
    url: string;
    file: File | Blob;
    fileFieldName?: string;
    method?: "POST" | "PUT";
    extraFields?: Record<string, string | number | boolean>;
    headers?: HeadersInit;
}): Promise<unknown> {
    const { url, file, fileFieldName = "file", method = "PUT", extraFields, headers } = options;

    const formData = new FormData();
    formData.append(fileFieldName, file);
    if (extraFields) {
        Object.entries(extraFields).forEach(([k, v]) => {
            if (v !== undefined && v !== null) formData.append(k, String(v));
        });
    }

    const res = await fetch(url, { method, body: formData, headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`uploadFile failed (${res.status}) ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
}

/** 서버 바이너리(Zip 등) 다운로드 */
export async function downloadBinaryAs(
    url: string,
    options?: {
        method?: "GET" | "POST" | "PUT" | "PATCH";
        headers?: HeadersInit;
        body?: unknown;
        filename?: string;
    }
): Promise<void> {
    const res = await fetch(url, {
        method: options?.method ?? "GET",
        headers: options?.headers,
        body: options?.body as BodyInit | null | undefined,
    });
    if (!res.ok) throw new Error(`download failed: ${res.status}`);

    const blob = await res.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    let fallbackName = options?.filename || "download.bin";
    const dispo = res.headers.get("content-disposition");
    const match = dispo?.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    if (match?.[1]) fallbackName = decodeURIComponent(match[1]);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fallbackName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
}

/** 해시 목록을 서버에서 압축 후 다운로드 */
export async function downloadCompressedByLabel(
    label: string,
    hashes: string[],
    options: {
        endpointUrl: string;
        method?: "POST" | "PUT";
        headers?: HeadersInit;
        payloadKey?: string;
        payloadValueStrategy?: (hashes: string[]) => unknown;
        sanitizeLabel?: (s: string) => string;
        filenameSuffix?: string;
    }
): Promise<void> {
    if (!hashes?.length) {
        alert("다운로드할 항목이 없습니다.");
        return;
    }

    const {
        endpointUrl,
        method = "POST",
        headers = { "Content-Type": "application/json" } as HeadersInit,
        payloadKey = "items",
        payloadValueStrategy = (h: string[]) => h,
        sanitizeLabel = (s: string) =>
            s.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_").trim() || "download",
        filenameSuffix = "_files.zip",
    } = options;

    const safeLabel = sanitizeLabel(label);
    const body = JSON.stringify({ [payloadKey]: payloadValueStrategy(hashes) });

    try {
        const res = await fetch(endpointUrl, { method, headers, body });
        if (!res.ok) throw new Error(`다운로드 실패: ${res.status}`);

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeLabel}${filenameSuffix}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        alert("압축 다운로드 중 오류가 발생했습니다.");
    }
}

/* -----------------------------------------------------------
 * 6) Email verification (generic, parametric)
 * ---------------------------------------------------------*/
export async function sendEmailVerification(
    email: string,
    options?: { url?: string; apiBase?: string; path?: string }
): Promise<string> {
    const apiBase = options?.apiBase ?? AUX_API_BASE;
    const path = options?.path ?? "/api/valid/email/send";
    const url = options?.url ?? buildUrl(`${apiBase}${path}`, { email });

    try {
        const res = await fetch(url, { method: "POST" });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`인증 메일 발송 실패 (${res.status}) ${text}`);
        }

        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
            const json: unknown = await res.json();
            if (typeof json === "string") return json;
            if (typeof (json as ApiEnvelope<string>)?.data === "string")
                return (json as ApiEnvelope<string>).data;
            return "Email 인증이 발송되었습니다.";
        }
        return (await res.text()) || "Email 인증이 발송되었습니다.";
    } catch (e) {
        console.error("sendEmailVerification failed:", e);

        try {
            const mock = await loadMock();
            const data =
                (mock["/api/valid/email/send"] as ApiEnvelope<string> | string | undefined) ?? undefined;
            if (typeof data === "string") return data;
            if (data && typeof (data as ApiEnvelope<string>).data === "string")
                return (data as ApiEnvelope<string>).data;
            return "Email 인증이 발송되었습니다.";
        } catch {
            return "Email 인증이 발송되었습니다. (mock)";
        }
    }
}

export async function checkEmailVerification(
    email: string,
    code: string,
    options?: { url?: string; apiBase?: string; path?: string }
): Promise<boolean> {
    const apiBase = options?.apiBase ?? AUX_API_BASE;
    const path = options?.path ?? "/api/valid/email/check";
    const url = options?.url ?? `${apiBase}${path}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        if (!res.ok) throw new Error(`인증 코드 확인 실패 (${res.status})`);

        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
            const json: unknown = await res.json();
            if (typeof json === "boolean") return json;
            if (typeof (json as ApiEnvelope<boolean>)?.data === "boolean")
                return Boolean((json as ApiEnvelope<boolean>).data);
            return false;
        }
        const text = await res.text();
        return /^true$/i.test(text.trim());
    } catch (e) {
        console.error("checkEmailVerification failed:", e);

        try {
            const mock = await loadMock();
            const data = mock["/api/valid/email/check"] as ApiEnvelope<boolean> | boolean | undefined;
            if (typeof data === "boolean") return data;
            if (typeof data === "object" && data && typeof (data as ApiEnvelope<boolean>).data === "boolean")
                return Boolean((data as ApiEnvelope<boolean>).data);
            return false;
        } catch {
            return false;
        }
    }
}
