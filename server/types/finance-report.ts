export interface CustomerBalanceRow {
  id: string
  customerId: string
  name: string
  type: string
  balance: number
  entryCount: number
  lastActivityAt?: string
}

export interface BankStatementRow {
  id: string
  bankAccountId: string
  account: string
  date: string
  occurredAt: string
  category: string
  description: string
  amount: number
  transactionType: 'Credit' | 'Debit'
  runningBalance: number
  referenceType: string
  referenceId: string
}

export interface CashFlowStatement {
  period: { startDate?: string; endDate?: string }
  receivedFromCustomers: number
  otherOperatingIncome: number
  paidForMaterials: number
  paidForOpex: number
  paidForWages: number
  netOperatingCash: number
  financingInflows: number
  capitalExpenditure: number
  netFinancingCash: number
  beginningCash: number
  netCashIncrease: number
  endingCash: number
}

export interface BalanceSheetStatement {
  asOfDate: string
  assets: {
    cashAndBank: number
    receivables: number
    inventory: number
    machinery: number
    depreciation: number
    totalCurrentAssets: number
    totalFixedAssets: number
    totalAssets: number
  }
  liabilities: {
    payables: number
    accruedExpenses: number
    totalLiabilities: number
  }
  equity: {
    ownerCapital: number
    retainedEarnings: number
    totalEquity: number
  }
  totalLiabilitiesAndEquity: number
  balanced: boolean
  notes: string[]
}

