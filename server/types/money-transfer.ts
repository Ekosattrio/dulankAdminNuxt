export interface MoneyTransfer {
  id: string
  no: string
  branchId: string
  fromAccountId: string
  toAccountId: string
  amount: number
  description: string
  occurredAt: string
  createdById: string
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface MoneyTransferView extends MoneyTransfer {
  date: string
  fromAccount: string
  toAccount: string
}

export interface MoneyTransferFormData {
  id?: string
  branchId?: string
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
  occurredAt: string
}

export interface MoneyTransferFilterParams {
  search?: string
  startDate?: string
  endDate?: string
}

