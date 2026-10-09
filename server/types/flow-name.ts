export interface FlowName {
  id: string
  no: string
  category: string
  name: string
  incentiveAmount: number
  unitIncentive: string
  flowAssignee: string
  flowType: string
  createDate: string
}

export interface FlowNameFilterParams {
  search?: string
  category?: string
  flowName?: string
  startDate?: string
  endDate?: string
}

export interface FlowNameFormData {
  id?: string
  no?: string
  category: string
  name: string
  incentiveAmount?: number
  unitIncentive?: string
  flowAssignee?: string
  flowType?: string
  createDate?: string
}
