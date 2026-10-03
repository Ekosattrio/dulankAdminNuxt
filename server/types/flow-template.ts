export interface FlowTemplate {
  id: string;
  no: string;
  name: string;
  information: string;
}

export interface FlowTemplateFilterParams {
  search?: string;
}

export interface FlowTemplateFormData {
  id?: string;
  no?: string;
  name: string;
  information: string;
}
