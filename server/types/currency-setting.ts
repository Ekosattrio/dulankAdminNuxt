export interface CurrencySetting {
  id: string
  name: string
  code: string
  symbol: string
  exchangeRate: number
  isDefault: boolean
  status: 'active' | 'inactive'
  createdOn: string
}

export type CurrencySettingFormData = Omit<CurrencySetting, 'id' | 'createdOn'>

