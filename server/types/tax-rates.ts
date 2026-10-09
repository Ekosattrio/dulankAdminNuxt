export interface TaxRateItem {
  id: number
  name: string
  rate: number
  createdOn: string
  status: 'Active' | 'Inactive'
}

export type TaxRateInput = Omit<TaxRateItem, 'id' | 'createdOn'>

export interface TaxRatesResponse {
  success: boolean
  data: TaxRateItem[]
  message?: string
}

