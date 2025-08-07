import type {
    RawModelSearchResponse,
    RawModelDetailResponse,
    ModelDetail,
    Filters,
    Photo,
    SaveResponse,
} from "../types/model";

// 공통 fetch 유틸
async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    return await res.json();
}

// 모델 목록 조회 API
export const fetchModels = async (
    page: number,
    filters: Filters,
    keyword: string
): Promise<RawModelSearchResponse> => {
    const params = new URLSearchParams();

    // 기본 쿼리 파라미터
    params.set("page", page.toString());
    params.set("size", "20");
    params.set("sortby", "createAt");
    params.set("sortdirection", "desc");
    params.set("activated", "true");

    // 상태 필터
    if (filters.status && filters.status !== "전체") {
        params.set("status", filters.status);
    }

    // 키워드 필터
    if (keyword.trim()) {
        params.set("name", keyword.trim());
    }

    const url = `/api/model/search?${params.toString()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API 호출 실패");
        return await res.json();
    } catch (err) {
        console.error("모델 목록 API 실패, 로컬 mock 사용:", err);

        try {
            const mockRes = await import("../mocks/mock-models.json");
            return mockRes.default;
        } catch (mockErr) {
            console.error("mock-models.json 로드 실패:", mockErr);
            throw mockErr;
        }
    }
};

// 모델 상세 조회 API
export async function fetchModelDetail(id: number): Promise<ModelDetail> {
    try {
        const res = await fetchJson<RawModelDetailResponse>(`/api/model?id=${id}`);
        return res.data;
    } catch {
        console.error("모델 상세 조회 실패, 로컬 fallback 사용");
        const mockJson = await import("../mocks/mock-detail.json");
        return mockJson.default.data;
    }
}

// 사진 리스트 조회 API
export async function fetchPhotos(
    id: number,
    pictureKind: string
): Promise<Photo[]> {
    try {
        const res = await fetchJson<{ data: Photo[] }>(
            `/api/search?id=${id}&kind=${pictureKind}`
        );
        return res.data;
    } catch {
        console.error("사진 조회 실패, 빈 배열 반환");
        return [];
    }
}

// 특이사항 또는 할인사항 수정
export const saveNoteOrDiscount = async (
    modelId: number,
    type: "note" | "discount",
    value: string
): Promise<SaveResponse> => {
    const res = await fetch(`/api/model/save-${type}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: modelId,
            [type]: value,
        }),
    });

    if (!res.ok) throw new Error(`${type} 저장 실패`);
    return await res.json();
};

// 계약서 업로드 API
export const uploadContractPdf = async (modelId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", modelId.toString());

    const res = await fetch("/api/model/contract/upload", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("계약서 업로드 실패");
    return await res.json();
};
