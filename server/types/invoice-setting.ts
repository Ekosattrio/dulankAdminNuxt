export interface InvoiceBankDetails {
  bankName: string
  accountNumber: string
  accountHolder: string
}

export interface InvoiceSetting {
  id?: string
  logoUrl: string
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  prefix: string
  numberPadding: number
  nextNumber: number
  dueDays: number
  roundOffEnabled: boolean
  roundOffType: 'Round Off Up' | 'Round Off Down' | 'Nearest 100' | 'Nearest 1000'
  showCompanyDetails: boolean
  headerTerms: string
  footerTerms: string
  bankDetails: InvoiceBankDetails
  taxPercentage: number
  updatedAt?: string
}
