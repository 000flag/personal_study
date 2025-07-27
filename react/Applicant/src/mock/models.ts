import type { Model, ModelSearchResponse } from '../types/types';

const mockModels: Model[] = [
    {
        id: 1,
        status: '신청',
        name: '테스트모바일',
        email: 'testmob@test.com',
        telNo: '010-1234-5678',
        height: 178,
        weight: 43,
        birth: '20250207',
        cstype: '동안얼굴성형, 지방흡입',
        activated: true,
        createdAt: '2025-07-24T10:01:14.009518',
        updatedAt: '2025-07-24T10:01:14.009518',
        bmi: '13.6',
        progressStage: '대기중',
        photoCount: 0,
        picSubmission: ['10', '11', '12', '13', '14', '15', '16'],
    },
    {
        id: 2,
        status: '검토',
        name: '테스트피씨',
        email: 'testpc@testpcpc.com',
        telNo: '010-1234-5678',
        height: 167,
        weight: 43,
        birth: '20210624',
        cstype: '가슴성형, 동안얼굴성형, 지방흡입',
        activated: true,
        createdAt: '2025-07-24T10:02:20.066465',
        updatedAt: '2025-07-24T10:02:20.066465',
        bmi: '15.4',
        progressStage: '대기중',
        photoCount: 0,
        picSubmission: ['1', '2', '3', '4', '5', '6', '7'],
    },
];

export const mockModelSearchResponse: ModelSearchResponse = {
    timestamp: new Date().toISOString(),
    data: {
        content: mockModels,
        pageable: {
            pageNumber: 0,
            pageSize: mockModels.length,
            totalPages: 1,
            totalElements: mockModels.length,
        },
        totalPages: 1,
        totalElements: mockModels.length,
    },
};
