/** API 로부터 내려오는 원시 모델 데이터 */
export interface RawModel {
    id: number;
    status: string;
    name: string;
    email: string;
    telNo: string;
    height: number;
    weight: number;
    birth: string;
    cstype: string;
    activated: boolean;
    createdAt: string;
    updatedAt: string;
    bmi: string;
    progressStage: string;
    photoCount: number;
    picSubmission: string;
}

/** /api/model/search 호출 시 반환되는 전체 스펙 */
export interface RawModelSearchResponse {
    timestamp: string;
    data: {
        content: RawModel[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                sorted: boolean;
                empty: boolean;
                unsorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        totalPages: number;
        totalElements: number;
        last: boolean;
        size: number;
        number: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        numberOfElements: number;
        first: boolean;
        empty: boolean;
    };
}

/** 목록용으로 변환된 Model 타입 */
export interface Model {
    id: number;
    status: string;
    name: string;
    email: string;
    telNo: string;
    height: number;
    weight: number;
    birth: string;
    cstype: string;
    activated: boolean;
    createdAt: string;
    updatedAt: string;
    bmi: string;
    progressStage: string;
    photoCount: number;
    picSubmission: string[];
}

/** 목록 조회 후 리턴 타입 */
export interface ModelSearchResponse {
    timestamp: string;
    data: {
        content: Model[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            totalPages: number;
            totalElements: number;
        };
        totalPages: number;
        totalElements: number;
    };
}

/** /api/model?id= 호출 시 내려오는 상세 모델 스펙 */
export interface RawModelDetailResponse {
    timestamp: string;
    data: RawModel & {
        custNo: string;
        age: number;
        experience: string;
        operDate: string;
        contractFilePath: string;
        picOperBefore: string;
        picOperAfter: string;
        picOperAfterWeek: string;
        picOperAfterWeek2: string;
        picOperAfterWeek3: string;
        picOperAfterMonth: string;
        picOperAfterMonth2: string;
        picOperAfterMonth3: string;
        picOperAfterMonth6: string;
        note: string;
        noteDiscount: string;
        pathZip: string;
    };
}

/** 상세 조회용으로 변환된 타입 (picSubmission: string[] 으로 파싱) */
export interface ModelDetail {
    id: number;
    custNo: string;
    status: string;
    name: string;
    email: string;
    telNo: string;
    height: number;
    weight: number;
    age: number;
    birth: string;
    experience: string;
    cstype: string;
    operDate: string;
    contractFilePath: string;
    picSubmission: string[];
    picOperBefore: string;
    picOperAfter: string;
    picOperAfterWeek: string;
    picOperAfterWeek2: string;
    picOperAfterWeek3: string;
    picOperAfterMonth: string;
    picOperAfterMonth2: string;
    picOperAfterMonth3: string;
    picOperAfterMonth6: string;
    note: string;
    noteDiscount: string;
    pathZip: string;
    activated: boolean;
    createdAt: string;
    updatedAt: string;
    bmi: string;
    progressStage: string;
    photoCount: number;
}

/** /api/search 호출 시 내려오는 사진 데이터 */
export interface Photo {
    id: number;
    externalPath: string;
    filename: string;
    thumbnailUrl?: string;
    fileSizeFormatted?: string;
}

/** 검색 필터용 타입 */
export interface Filters {
    id?: string;
    cusNo?: string;
    status?: string;        // 신청, 승인, 거절, 완료
    name?: string;
    email?: string;
    telNo?: string;
    cstype?: string;
    minHeight?: string;
    maxHeight?: string;
    minWeight?: string;
    maxWeight?: string;
    minAge?: string;
    maxAge?: string;
    birth?: string;         // yyyyMMdd
    operDateFrom?: string;  // yyyy-MM-dd
    operDateTo?: string;    // yyyy-MM-dd
    activated?: string;     // "true" | "false"
    createdFrom?: string;   // yyyy-MM-dd'T'HH:mm:ss
    createdTo?: string;     // yyyy-MM-dd'T'HH:mm:ss
}