export interface CustomerSubscriptionItem {
  id: string | null
  customerId: string
  customer: string
  email: string
  plan: string | null
  planTier: string | null
  billingCycle: string | null
  paymentMethod: string | null
  amount: number
  createdDate: string | null
  expiringOn: string | null
  status: 'Paid' | 'Unpaid' | null
  active: boolean
}

export interface CustomerSubscriptionSummary {
  totalSubscribers: number
  activeSubscribers: number
  expiredSubscribers: number
}

export interface CustomerSubscriptionQuery {
  search?: string
  status?: string
  plan?: string
}

export interface SubscribePayload {
  customerId: string
  plan?: string
  planTier?: 'Basic' | 'Advanced' | 'Enterprise'
  billingCycle?: '30 Days' | '365 Days'
  paymentMethod?: string
  amount: number
  createdDate?: string
  expiringOn?: string
  status?: 'Paid' | 'Unpaid'
}