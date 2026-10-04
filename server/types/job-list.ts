export interface JobListItem {
  id: string
  no: string
  jobOrderId?: string
  orderNo?: string
  customerId?: string
  branchId?: string
  productId?: string
  salesDate: string
  customer: string
  product: string
  flow: string
  flowType: 'In-House' | 'Outsource' | string
  assignee: string
  dateComplete: string
  orderSummary?: string
  jobTitle?: string
  description?: string
  qtyOk?: number | string
  qtyRusak?: number | string
}

export interface JobListFilterParams {
  search?: string
  flow?: string
  startDate?: string
  endDate?: string
}

export interface FlowSummary {
  name: string
  count: number
}
