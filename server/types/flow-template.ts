export interface FlowTemplateItem {
  id?: string;
  label: string;
  type: 'Input Type' | 'Select Type';
  options?: string[];
}

export interface FlowTemplate {
  id: string;
  no: string;
  name: string;
  information: string;
  items?: FlowTemplateItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FlowTemplateFilterParams {
  search?: string;
  template?: string;
  startDate?: string;
  endDate?: string;
}

export interface FlowTemplateFormData {
  id?: string;
  no?: string;
  name: string;
  information?: string;
  items?: FlowTemplateItem[];
}
