export type TaxCreditStatus = 'Yes' | 'No'
export type OutputTaxStatus = 'Issued' | 'Draft' | 'Cancelled'

export interface InputTaxDocument {
  id: string
  purchaseId: string
  invoiceDate: string
  fakturNo: string
  credited: TaxCreditStatus
  createdAt: string
  updatedAt: string
}
export interface InputTaxView extends InputTaxDocument {
  purchaseNo: string
  supplierName: string
  dpp: number
  vat: number
}
export interface InputTaxFormData { id: string; invoiceDate: string; fakturNo: string; credited: TaxCreditStatus }

export interface OutputTaxDocument {
  id: string
  saleId: string
  etaxDate: string
  etaxNumber: string
  txCode: string
  status: OutputTaxStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
export interface OutputTaxView extends OutputTaxDocument {
  salesNo: string
  customerName: string
  dpp: number
  vat: number
  total: number
}
export interface OutputTaxFormData { id: string; etaxDate: string; etaxNumber: string; txCode: string; status: OutputTaxStatus }

