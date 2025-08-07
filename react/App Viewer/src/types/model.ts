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
    note: string;
    discount: string;
}

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

export interface ModelSearchResponse {
    timestamp: string;
    data: {
        content: RawModel[];
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

export interface RawModelDetailResponse {
    timestamp: string;
    data: RawModel & {
        custNo: string;
        age: number;
        experience: string;
        operDate: string;
        contractFilePath: string;
        picSubmission: string;
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
        discount: string;
        pathZip: string;
    };
}

export interface ModelDetail extends RawModel {
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
    discount: string;
    pathZip: string;
}

export interface Photo {
    id: number;
    externalPath: string;
    filename: string;
    thumbnailUrl?: string;
    fileSizeFormatted?: string;
}

export interface Filters {
    id?: string;
    cusNo?: string;
    status?: string;
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
    birth?: string;
    operDateFrom?: string;
    operDateTo?: string;
    activated?: string;
    createdFrom?: string;
    createdTo?: string;
}

export interface SaveResponse {
    success: boolean;
    message: string;
}