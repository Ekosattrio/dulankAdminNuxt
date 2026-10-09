import { readJSON } from './data'
import { isDateWithinRange } from './dateRange'
import type { BankAccount, BankAccountLedgerEntry } from '#server/types/bank-account'
import type { CustomerAccountEntry, CustomerRecord } from '#server/types/customer'
import type { Expense } from '#server/types/expense'
import type { BalanceSheetStatement, BankStatementRow, CashFlowStatement, CustomerBalanceRow } from '#server/types/finance-report'
import type { Invoice } from '#server/types/invoice'

interface PurchaseSnapshot { due?: number; paymentStatus?: string; status?: string }

function accountLabel(account: BankAccount): string {
  return `${account.bankName} ${account.accountNo} - ${account.accountName}`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date)
}

function signedAmount(entry: BankAccountLedgerEntry): number {
  return entry.direction === 'credit' ? entry.amount : -entry.amount
}

function beforeOrOn(value: string, endDate?: string): boolean {
  return !endDate || value.slice(0, 10) <= endDate
}

export function getCustomerBalanceRows(): CustomerBalanceRow[] {
  const customers = readJSON<CustomerRecord[]>('customers.json', [])
  const entries = readJSON<CustomerAccountEntry[]>('customer-account-entries.json', [])
  return customers.map((customer) => {
    const related = entries.filter((entry) => entry.customerId === customer.customerId)
    return {
      id: customer.id,
      customerId: customer.customerId,
      name: customer.name,
      type: customer.type,
      balance: related.reduce((sum, entry) => sum + entry.amount, 0),
      entryCount: related.length,
      lastActivityAt: related.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0]?.occurredAt,
    }
  })
}

export function getBankStatementRows(params: { accountId?: string; startDate?: string; endDate?: string; search?: string }): BankStatementRow[] {
  const accounts = readJSON<BankAccount[]>('bank-accounts.json', [])
  const entries = readJSON<BankAccountLedgerEntry[]>('bank-account-ledger.json', [])
  const labels = new Map(accounts.map((account) => [account.id, accountLabel(account)]))
  const query = params.search?.trim().toLowerCase()
  const balances = new Map<string, number>()

  return [...entries]
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id))
    .map((entry): BankStatementRow => {
      const runningBalance = (balances.get(entry.bankAccountId) ?? 0) + signedAmount(entry)
      balances.set(entry.bankAccountId, runningBalance)
      return {
        id: entry.id,
        bankAccountId: entry.bankAccountId,
        account: labels.get(entry.bankAccountId) ?? 'Unknown Account',
        date: formatDate(entry.occurredAt),
        occurredAt: entry.occurredAt,
        category: entry.referenceType.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
        description: entry.description,
        amount: entry.amount,
        transactionType: entry.direction === 'credit' ? 'Credit' : 'Debit',
        runningBalance,
        referenceType: entry.referenceType,
        referenceId: entry.referenceId,
      }
    })
    .filter((row) => {
      if (params.accountId && row.bankAccountId !== params.accountId) return false
      if (!isDateWithinRange(row.occurredAt.slice(0, 10), params.startDate, params.endDate)) return false
      return !query || [row.account, row.category, row.description, row.referenceId].some((value) => value.toLowerCase().includes(query))
    })
}

export function getCashFlowStatement(startDate?: string, endDate?: string): CashFlowStatement {
  const entries = readJSON<BankAccountLedgerEntry[]>('bank-account-ledger.json', [])
  const beginningCash = entries
    .filter((entry) => !startDate || entry.occurredAt.slice(0, 10) < startDate)
    .reduce((sum, entry) => sum + signedAmount(entry), 0)
  const periodEntries = entries.filter((entry) => isDateWithinRange(entry.occurredAt.slice(0, 10), startDate, endDate))
  const incomes = periodEntries.filter((entry) => entry.referenceType === 'income' || entry.referenceType === 'payment')
  const expenses = periodEntries.filter((entry) => entry.referenceType === 'expense')
  const receivedFromCustomers = incomes.filter((entry) => /invoice|cetak|customer|pelunasan|dp/i.test(entry.description)).reduce((sum, entry) => sum + entry.amount, 0)
  const otherOperatingIncome = incomes.reduce((sum, entry) => sum + entry.amount, 0) - receivedFromCustomers
  const paidForMaterials = expenses.filter((entry) => /bahan|kertas|tinta|material/i.test(entry.description)).reduce((sum, entry) => sum + entry.amount, 0)
  const paidForWages = expenses.filter((entry) => /gaji|upah|wage|salary/i.test(entry.description)).reduce((sum, entry) => sum + entry.amount, 0)
  const paidForOpex = expenses.reduce((sum, entry) => sum + entry.amount, 0) - paidForMaterials - paidForWages
  const financingInflows = periodEntries.filter((entry) => entry.referenceType === 'adjustment' && entry.direction === 'credit').reduce((sum, entry) => sum + entry.amount, 0)
  const capitalExpenditure = periodEntries.filter((entry) => entry.referenceType === 'cash_advance' || (entry.referenceType === 'adjustment' && entry.direction === 'debit')).reduce((sum, entry) => sum + entry.amount, 0)
  const netOperatingCash = receivedFromCustomers + otherOperatingIncome - paidForMaterials - paidForOpex - paidForWages
  const netFinancingCash = financingInflows - capitalExpenditure
  const netCashIncrease = netOperatingCash + netFinancingCash
  return {
    period: { startDate, endDate }, receivedFromCustomers, otherOperatingIncome, paidForMaterials,
    paidForOpex, paidForWages, netOperatingCash, financingInflows, capitalExpenditure,
    netFinancingCash, beginningCash, netCashIncrease, endingCash: beginningCash + netCashIncrease,
  }
}

export function getBalanceSheetStatement(asOfDate: string): BalanceSheetStatement {
  const ledger = readJSON<BankAccountLedgerEntry[]>('bank-account-ledger.json', []).filter((entry) => beforeOrOn(entry.occurredAt, asOfDate))
  const invoices = readJSON<Invoice[]>('invoices.json', [])
  const purchases = readJSON<PurchaseSnapshot[]>('purchases.json', [])
  const expenses = readJSON<Expense[]>('expenses.json', [])
  const cashAndBank = ledger.reduce((sum, entry) => sum + signedAmount(entry), 0)
  const receivables = invoices.reduce((sum, invoice) => sum + Number(invoice.amountDue || 0), 0)
  const payables = purchases.reduce((sum, purchase) => sum + Number(purchase.due || 0), 0)
  const accruedExpenses = expenses.reduce((sum, expense) => sum + Number(expense.due || 0), 0)
  const ownerCapital = ledger.filter((entry) => entry.referenceType === 'opening_balance').reduce((sum, entry) => sum + signedAmount(entry), 0)
  const totalCurrentAssets = cashAndBank + receivables
  const totalFixedAssets = 0
  const totalAssets = totalCurrentAssets + totalFixedAssets
  const totalLiabilities = payables + accruedExpenses
  const retainedEarnings = totalAssets - totalLiabilities - ownerCapital
  const totalEquity = ownerCapital + retainedEarnings
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity
  return {
    asOfDate,
    assets: { cashAndBank, receivables, inventory: 0, machinery: 0, depreciation: 0, totalCurrentAssets, totalFixedAssets, totalAssets },
    liabilities: { payables, accruedExpenses, totalLiabilities },
    equity: { ownerCapital, retainedEarnings, totalEquity },
    totalLiabilitiesAndEquity,
    balanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
    notes: [
      'Inventory valuation is not available in the current product dataset and is reported as zero.',
      'Fixed-asset acquisition cost and depreciation are not available and are reported as zero.',
      'Retained earnings includes the reconciliation of known assets and liabilities until a complete double-entry journal is available.',
    ],
  }
}

