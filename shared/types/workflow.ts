// workflow.ts — type/interface untuk domain workflow (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface EditFlowStepOption {
  id: string;
  name: string;
  category: "Design" | "Pracetak" | "Cetak" | "Finishing";
  selected: boolean;
  template: string;
}

export interface FlowCategory {
  id: number
  code: string
  name: string
  usedCount: number
  createdBy: string
  createdDate: string
}

export interface FlowNameItem {
  id: number
  code: string
  category: string
  name: string
  incentive: number
  unit: string
  assignees: string
  flowType: 'Inhouse' | 'Outsource'
  createdInfo: string
}

export interface FlowStepOption {
  id: string
  name: string
  category: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing'
  selected: boolean
  template: string
}

export interface FlowTemplateItem {
  id: number
  code: string
  name: string
  information: string
}

export interface WorkflowItem {
  id: string;
  no: string;
  category: string;
  product: string;
  workflowSteps: string;
}
