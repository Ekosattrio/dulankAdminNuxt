export type PaymentFlowKind = 'inflow' | 'outflow'
export type PaymentFlowStatus = 'Paid' | 'Partial' | 'Unpaid'
export type PaymentFlowMethod = 'Cash' | 'Transfer' | 'Balance' | '-'

export interface PaymentBalanceEntry {
  bankAccount: string
  accountName: string
  amountBalance: number
}

export interface PaymentTransactionDetail {
  refNo: string
  source: string
  amount: number
  status: PaymentFlowStatus
}

export interface PaymentHistoryEntry {
  id: string
  amount: number
  datePayment: string
  method: PaymentFlowMethod
  createdPayment: string
  fromAccount?: string
  toAccount?: string
}

export interface PaymentBankTransfer {
  fromBankAccount?: string
  toBankWallet?: string
  toAccountName?: string
  toAccountNumber?: string
  reference?: string
}

export interface PaymentFlowRecord {
  id: string
  date: string
  refNo: string
  name: string
  source: string
  amount: number
  dueDate?: string
  status: PaymentFlowStatus
  method: PaymentFlowMethod
  note: string
  paymentDate?: string
  bankTransfer?: PaymentBankTransfer
  transactionDetails?: PaymentTransactionDetail[]
  payments?: PaymentHistoryEntry[]
}

export interface PaymentFlowFormData {
  id?: string
  date: string
  refNo?: string
  name: string
  source: string
  amount: number
  dueDate?: string
  status?: PaymentFlowStatus
  method: PaymentFlowMethod
  note?: string
  paymentDate?: string
  paymentAmount?: number
  bankTransfer?: PaymentBankTransfer
  transactionDetails?: PaymentTransactionDetail[]
}

export interface PaymentFlowFilterParams {
  search?: string
  date?: string
  startDate?: string
  endDate?: string
  source?: string
  status?: string
}
