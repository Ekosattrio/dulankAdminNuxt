export type SubscriptionPlanTier = 'Basic' | 'Advanced' | 'Enterprise'
export type SubscriptionBillingCycle = '30 Days' | '365 Days'
export type SubscriptionPaymentMethod = 'Credit Card' | 'Debit Card' | 'Paypal'
export type SubscriptionStatus = 'Paid' | 'Unpaid'

export interface SubscriptionRecord {
  id: string
  subscriberId: string
  subscriber: string
  planTier: SubscriptionPlanTier
  plan: string
  billingCycle: SubscriptionBillingCycle
  paymentMethod: SubscriptionPaymentMethod
  amount: number
  createdDate: string
  expiringOn: string
  status: SubscriptionStatus
  createdAt: string
  updatedAt: string
}

export interface SubscriptionSummary {
  totalTransactions: number
  totalSubscribers: number
  activeSubscribers: number
  expiredSubscribers: number
}

export interface SubscriptionStore {
  summary: SubscriptionSummary
  records: SubscriptionRecord[]
}

export interface SubscriptionFilterQuery {
  search?: string
  plan?: string
  paymentMethod?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface SubscriptionUpdateCommand {
  subscriber?: string
  planTier?: SubscriptionPlanTier
  billingCycle?: SubscriptionBillingCycle
  paymentMethod?: SubscriptionPaymentMethod
  amount?: number
  createdDate?: string
  expiringOn?: string
  status?: SubscriptionStatus
}
