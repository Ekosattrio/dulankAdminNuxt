export type BankAccountStatus = 'Active' | 'Inactive'
export type BankLedgerDirection = 'credit' | 'debit'

export interface BankAccountType {
  id: string
  name: string
  status: BankAccountStatus
  createdAt: string
  updatedAt: string
}

export interface BankAccountTypeView extends BankAccountType {
  createdDate: string
  accountCount: number
}

export interface BankAccount {
  id: string
  branchId: string
  accountTypeId: string
  accountName: string
  bankName: string
  accountNo: string
  openingBalance: number
  ifsc: string
  description: string
  status: BankAccountStatus
  createdAt: string
  updatedAt: string
}

export interface BankAccountView extends BankAccount {
  accountTypeName: string
  branchName: string
  currentBalance: number
}

export interface BankAccountLedgerEntry {
  id: string
  bankAccountId: string
  branchId: string
  direction: BankLedgerDirection
  amount: number
  occurredAt: string
  referenceType: 'opening_balance' | 'payment' | 'transfer' | 'income' | 'expense' | 'cash_advance' | 'adjustment'
  referenceId: string
  description: string
  createdAt: string
}

export interface BankAccountFormData {
  id?: string
  branchId?: string
  accountTypeId: string
  accountName: string
  bankName: string
  accountNo: string
  openingBalance: number
  ifsc: string
  description?: string
  status?: BankAccountStatus
}

export interface BankAccountTypeFormData {
  id?: string
  name: string
  status?: BankAccountStatus
}

export interface BankAccountFilterParams {
  search?: string
  status?: string
  accountTypeId?: string
}

