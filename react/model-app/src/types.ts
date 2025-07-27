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

export interface Photo {
  id: number;
  externalPath: string;
  filename: string;
  [key: string]: any;
}