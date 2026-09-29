// job.ts — type/interface untuk domain job (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface FlowCategoryCount {
  name: string
  count: number
}

export interface JobBranchItem {
  id: number
  jobNo: string
  branch: string
  customer: string
  product: string
  flowName: string
  priority: 'Urgent' | 'High' | 'Reguler'
  status: 'Waiting' | 'On Process' | 'Complete'
}

export interface JobItem {
  id: number
  jobOrderNo: string
  salesDate: string
  customer: string
  product: string
  flow: string
  flowType: 'In-House' | 'Outsource'
  assignee: string
  dateComplete: string
}

export interface JobOrder {
  id: string;
  no: string;
  dueDate: string;
  customer: string;
  product: string;
  jobTitle: string;
  priority: "High" | "Medium" | "Low";
  status: "Waiting" | "On Process" | "Completed";
  workflowType: string;
  workflowCategory: "Design" | "Pracetak" | "Cetak" | "Finishing";
  salesNo: string;
  salesDate: string;
  shipping: string;
  orderSummary: string;
  steps: Array<{ name: string; status: "done" | "active" | "pending" }>;
}

export interface JobProgressItem {
  id: number
  progressCode: string
  product: string
  description: string
  process: string
  completedBy: string
  time: string
  note: string
  isCompleted: boolean
}

export interface MyJobItem {
  id: number;
  flowName: string;
  priority: "Urgent" | "High" | "Normal";
  product: string;
  title: string;
  description: string;
  status: "Waiting" | "On Process" | "Complete" | "Hold";
}

export interface OrderProduct {
  id: number
  name: string
  jobTitle: string
  description: string
  qty: string
  priority: 'Urgent' | 'High' | 'Normal' | 'Low'
  workflow: WorkflowStep[]
}

export interface WorkflowStep {
  id: number
  flowName: string
  branch: string
  assignee: string
  incentive: number
}
