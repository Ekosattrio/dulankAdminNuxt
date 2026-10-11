export interface WorkFlowStepItem {
  id?: string;
  name: string;
  category: string;
  template?: string;
  selected?: boolean;
}

export interface WorkFlow {
  id: string;
  no: string;
  date: string;
  category: string;
  product: string;
  productId?: string;
  workflowSteps: string;
  steps?: WorkFlowStepItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkFlowFilterParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkFlowFormData {
  id?: string;
  no?: string;
  date?: string;
  category: string;
  product: string;
  productId?: string;
  workflowSteps: string;
  steps?: WorkFlowStepItem[];
}

export interface WorkFlowEditorFlow {
  id: string
  name: string
  category: string
  templateNames: string[]
}

export interface WorkFlowEditorProduct {
  id: string
  code: string
  name: string
  category: string
}

export interface WorkFlowEditorContext {
  products: WorkFlowEditorProduct[]
  productCategories: string[]
  flowCategories: string[]
  flows: WorkFlowEditorFlow[]
  templates: string[]
}
