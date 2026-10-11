export type DiscountPlanStatus = 'Active' | 'Inactive'

export interface DiscountPlanCustomerSegment {
  id: string
  name: string
  filterLabel?: string
  availableInFilter: boolean
  availableInForm: boolean
  createdAt: string
}

export interface DiscountPlanRecord {
  id: string
  customerSegmentId: string
  createdByEmployeeId: string
  name: string
  status: DiscountPlanStatus
  createdAt: string
  updatedAt: string
}

export interface DiscountPlanStore {
  customerSegments: DiscountPlanCustomerSegment[]
  records: DiscountPlanRecord[]
}

export interface DiscountPlanView extends DiscountPlanRecord {
  customers: string
}

export interface DiscountPlanMeta {
  filterCustomerSegments: DiscountPlanCustomerSegment[]
  formCustomerSegments: DiscountPlanCustomerSegment[]
}

export interface DiscountPlanQuery {
  search?: string
  customerSegmentId?: string
  status?: string
}

export interface DiscountPlanCommand {
  name: string
  customerSegmentId: string
  status: DiscountPlanStatus
}

export interface DiscountPlanCustomerSegmentCommand {
  name: string
}
