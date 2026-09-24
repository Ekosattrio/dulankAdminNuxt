export interface IncomeRecord {
  id: string
  date: string
  no: string
  name: string
  category: string
  notes: string
  amount: number
  paymentMethod?: string
  bankAccount?: string
  isCancelled?: boolean
}

export interface IncomeFilterParams {
  search?: string
  category?: string
}

export interface IncomeFormData {
  id?: string
  no?: string
  date: string
  name: string
  category: string
  notes: string
  amount: number
  paymentMethod?: string
  bankAccount?: string
  isCancelled?: boolean
}

