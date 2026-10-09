export type CalculatorPartnerKind = 'printing_shop' | 'paper_shop' | 'listing_source'
export type CalculatorListingCategory =
  | 'offset'
  | 'laminate'
  | 'die_cutting'
  | 'hot_print'
  | 'paper_group'
  | 'paper_size'
  | 'paper_type'
  | 'paper_price'

export type CalculatorVisibility = 'Publish' | 'Private'
export type CalculatorRecordStatus = 'Active' | 'Inactive'
export type CalculatorModerationAction = 'warning' | 'ban' | 'freeze'
export type CalculatorNotificationChannel = 'no' | 'whatsapp' | 'email'

export interface CalculatorPartner {
  id: string
  kind: CalculatorPartnerKind
  name: string
  address: string
  joinDate?: string
  subscribed?: boolean
  whatsapp?: string
  capabilities?: string[]
  moderationStatus: 'active' | 'frozen' | 'banned' | 'archived'
  frozenUntil?: string | null
  createdAt: string
  updatedAt: string
}

export interface CalculatorPartnerMetric {
  id: string
  partnerId: string
  paper: number
  group: number
  size: number
  type: number
  offset: number
  laminate: number
  dieCutting: number
  hotPrint: number
  recordedAt: string
}

export interface CalculatorListingDetails {
  colors?: number
  minimumPrice?: number
  druck?: number
  minSize?: string
  maxSize?: string
  pricePerCm?: number
  standardRate?: number
  standardMinimum?: number
  halfCutRate?: number
  halfCutMinimum?: number
  minimumCount?: number
  paperGroup?: string
  brand?: string
  size?: string
  unit?: string
  grammage?: number
  minimumOrder?: number
  minimumOrderUnit?: string
  orderMultiple?: number
  orderMultipleUnit?: string
  paperPrice?: number
  priceUnit?: string
}

export interface CalculatorListing {
  id: string
  category: CalculatorListingCategory
  sourcePartnerId: string
  name: string
  details: CalculatorListingDetails
  visibility: CalculatorVisibility
  status: CalculatorRecordStatus
  updatedAt: string
  archivedAt?: string | null
}

export interface CalculatorPartnerRow extends CalculatorPartner {
  metrics: CalculatorPartnerMetric
}

export interface CalculatorListingRow extends CalculatorListing {
  sourceName: string
  sourceAddress: string
}

export interface CalculatorModerationInput {
  action: CalculatorModerationAction
  freezeDays?: number
  notification: CalculatorNotificationChannel
  message: string
}

export interface CalculatorModerationHistory {
  id: string
  partnerId: string
  action: CalculatorModerationAction
  freezeDays?: number
  notification: CalculatorNotificationChannel
  message: string
  createdAt: string
}
