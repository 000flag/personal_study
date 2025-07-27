import type {
    RawModelSearchResponse,
    ModelSearchResponse,
    RawModel,
    Model,
    RawModelDetailResponse,
    ModelDetail,
    Photo,
} from '../types/types';

// 개발용 mock 데이터
import { mockModelSearchResponse } from '../mock/models';
import { mockPhotos } from '../mock/photos';

// .env 로부터 mock 사용 여부 토글
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * 지원자 목록 페이징 조회 + 검색(q) + 상세 필터 지원
 */
export async function fetchModels(
    page: number,
    filters: Record<string, string | number | boolean>,
    sortBy: string = 'createdAt', // 기본값 유지
    sortDirection: 'asc' | 'desc' | 'ASC' | 'DESC' = 'DESC' // 기본값 유지
): Promise<ModelSearchResponse> {
    if (USE_MOCK) {
        return new Promise((res) =>
            setTimeout(() => res(mockModelSearchResponse), 300)
        );
    }

    const params = new URLSearchParams({
        page: page.toString(),
        size: '20',
        sortBy: sortBy,
        sortDirection: sortDirection.toUpperCase(),
    });

    // filters에 name 등 키 추가
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
        }
    });

    try {
        const res = await fetch(`/api/model/search?${params.toString()}`);
        // console.log('API 호출됨:', res.status, res.url);
        const raw = (await res.json()) as RawModelSearchResponse;

        const content: Model[] = raw.data.content.map((item: RawModel) => ({
            ...item,
            picSubmission: JSON.parse(item.picSubmission || '[]'),
        }));

        return {
            timestamp: raw.timestamp,
            data: {
                content,
                pageable: {
                    pageNumber: raw.data.pageable.pageNumber,
                    pageSize: raw.data.pageable.pageSize,
                    totalPages: raw.data.totalPages,
                    totalElements: raw.data.totalElements,
                },
                totalPages: raw.data.totalPages,
                totalElements: raw.data.totalElements,
            },
        };
    } catch (err) {
        console.error('fetchModels 내부 에러:', err);
        return createEmptyModelSearchResponse();
    }
}

/**
 * 상세 모델 조회
 */
export async function fetchModelDetail(id: number): Promise<ModelDetail> {
    if (USE_MOCK) {
        return getMockModelDetail(id);
    }

    const res = await fetch(`/api/model?id=${id}`);
    const raw = (await res.json()) as RawModelDetailResponse;

    return {
        ...raw.data,
        picSubmission: JSON.parse(raw.data.picSubmission || '[]'),
    };
}

/**
 * 지원자 상태(status) 변경
 */
export async function updateModelStatus(detail: ModelDetail): Promise<void> {
    await fetch('/api/model', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detail),
    });
}

/**
 * 지원자 사진 조회
 */
export async function fetchPhotos(ids: string[]): Promise<Photo[]> {
    if (USE_MOCK) {
        return new Promise((res) => setTimeout(() => res(mockPhotos), 200));
    }

    const photos: Photo[] = [];
    for (const id of ids) {
        const resp = await fetch(`/api/search?id=${id}`);
        const json = (await resp.json()) as { data: { content: Photo[] } };
        if (Array.isArray(json.data.content)) {
            photos.push(...json.data.content);
        }
    }
    return photos;
}

/**
 * 실패 시 생성 함수
 */
export function createEmptyModelSearchResponse(): ModelSearchResponse {
    return {
        timestamp: '',
        data: {
            content: [],
            pageable: {
                pageNumber: 0,
                pageSize: 20,
                totalPages: 1,
                totalElements: 0,
            },
            totalPages: 1,
            totalElements: 0,
        },
    };
}

/**
 * 모델 상세 - Mock
 */
export function getMockModelDetail(id: number): ModelDetail {
    const raw = mockModelSearchResponse.data.content.find((m) => m.id === id);
    if (!raw) {
        throw new Error(`MockModel for id=${id} not found`);
    }

    return {
        id: raw.id,
        status: raw.status,
        name: raw.name,
        email: raw.email,
        telNo: raw.telNo,
        height: raw.height,
        weight: raw.weight,
        birth: raw.birth,
        cstype: raw.cstype,
        activated: raw.activated,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        bmi: raw.bmi,
        progressStage: raw.progressStage,
        photoCount: raw.photoCount,
        picSubmission: raw.picSubmission,

        // Mock 상세 필드
        custNo: `CUST${String(raw.id).padStart(4, '0')}`,
        age: 30,
        experience: 'Mock 경험 텍스트',
        operDate: '2025-07-01',
        contractFilePath: '/mock/contract.pdf',
        picOperBefore: '',
        picOperAfter: '',
        picOperAfterWeek: '',
        picOperAfterWeek2: '',
        picOperAfterWeek3: '',
        picOperAfterMonth: '',
        picOperAfterMonth2: '',
        picOperAfterMonth3: '',
        picOperAfterMonth6: '',
        note: 'Mock 노트 내용',
        noteDiscount: '',
        pathZip: '/mock/data.zip',
    };
}