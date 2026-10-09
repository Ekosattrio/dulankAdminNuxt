export interface JobBranchInfoItem {
  id: string
  label: string
  value: string
}

export interface JobBranchAfterItem {
  id: string
  label: string
}

export interface JobBranchHistoryItem {
  id?: string
  date: string
  branch: string
  customer: string
  flowName: string
  dateFinish: string
}

export interface JobBranchItem {
  id: string
  no: string
  jobOrderId?: string
  orderNo?: string
  customerId?: string
  branchId?: string
  branch: string
  customer: string
  product: string
  flowName: string
  priority: 'High' | 'Urgent' | 'Reguler' | string
  status: 'Waiting' | 'On Process' | 'Completed' | string
  jobTitle?: string
  description?: string
  qty?: string
  date?: string
  dateFinish?: string
  infoList?: JobBranchInfoItem[]
  afterInfoList?: JobBranchAfterItem[]
  assignees?: string[]
  incentiveAmount?: number | string
  incentiveUnit?: string
}

export interface JobBranchFilterParams {
  search?: string
  branch?: string
  priority?: string
  startDate?: string
  endDate?: string
}

export interface JobBranchUpdatePayload {
  priority?: string
  status?: string
  branch?: string
  infoList?: JobBranchInfoItem[]
  afterInfoList?: JobBranchAfterItem[]
  assignees?: string[]
  incentiveAmount?: number | string
  incentiveUnit?: string
}
