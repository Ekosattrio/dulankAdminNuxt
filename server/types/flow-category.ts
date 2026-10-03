export interface FlowCategory {
  id: string;
  no: string;
  name: string;
  used: number;
  createdBy: string;
  createdDate: string;
}

export interface FlowCategoryFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface FlowCategoryFormData {
  id?: string;
  no?: string;
  name: string;
  used?: number;
  createdBy?: string;
  createdDate?: string;
}
