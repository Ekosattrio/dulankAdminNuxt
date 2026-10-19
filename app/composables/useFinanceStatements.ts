import type { BalanceSheetStatement, BankStatementRow, CashFlowStatement, CustomerBalanceRow } from '#server/types/finance-report'
import type { DateRangeValue } from '~/composables/useDateRange'

interface ApiResponse<T> { success: boolean; data: T }

/** Payload backend `/api/v1/admin/finance/customer-entries`. */
interface CustomerEntryRow {
  id: string
  customerId: string
  customer: string | null
  sourceType: string
  sourceId: string | null
  amount: number
  occurredAt: string | null
  note: string | null
}

/** Payload backend `/api/v1/admin/bank-accounts/{id}/statement`. */
interface BankStatementPayload {
  account: { accountName: string; bankName: string; accountNo: string } | null
  openingBalance: number
  totalCredit: number
  totalDebit: number
  currentBalance: number
  entries: Array<{
    id: string
    direction: string
    amount: number
    occurredAt: string
    referenceType: string | null
    referenceId: string | null
    description: string | null
  }>
}

/** Payload backend `/api/v1/admin/finance/cash-flow`. */
interface CashFlowPayload {
  totalInflow: number
  totalOutflow: number
  net: number
  breakdown: Array<{ referenceType: string | null; direction: string; total: number }>
}

const mapCustomerBalances = (rows: CustomerEntryRow[]): CustomerBalanceRow[] => {
  const groups = new Map<string, { name: string; balance: number; count: number; last: string | null }>()

  for (const row of rows) {
    const group = groups.get(row.customerId) ?? { name: row.customer ?? 'Tanpa Nama', balance: 0, count: 0, last: null }
    const isPayment = row.sourceType === 'payment'
    group.balance += isPayment ? -row.amount : row.amount
    group.count += 1
    if (row.occurredAt && (!group.last || row.occurredAt > group.last)) {
      group.last = row.occurredAt
    }
    groups.set(row.customerId, group)
  }

  return [...groups.values()].map(group => ({
    id: group.name,
    customerId: group.name,
    name: group.name,
    type: '',
    balance: group.balance,
    entryCount: group.count,
    lastActivityAt: group.last ?? undefined,
  }))
}

const mapAccountStatements = (accountId: string, payload: BankStatementPayload): BankStatementRow[] => {
  const rows = [...payload.entries].reverse()
  let running = 0

  return rows.map(entry => {
    const isCredit = entry.direction === 'credit'
    running += isCredit ? entry.amount : -entry.amount

    return {
      id: entry.id,
      bankAccountId: accountId,
      account: payload.account?.accountName ?? '',
      date: entry.occurredAt?.slice(0, 10) ?? '',
      occurredAt: entry.occurredAt ?? '',
      category: entry.referenceType ?? '',
      description: entry.description ?? '',
      amount: entry.amount,
      transactionType: isCredit ? ('Credit' as const) : ('Debit' as const),
      runningBalance: running,
      referenceType: entry.referenceType ?? '',
      referenceId: entry.referenceId ?? '',
    }
  })
}

const refKind = (type: string | null): string => {
  const value = (type ?? '').toLowerCase()

  if (value.includes('order') || value.includes('sale')) return 'order'
  if (value.includes('purchase')) return 'purchase'
  if (value.includes('expense')) return 'expense'
  if (value.includes('payroll') || value.includes('salary') || value.includes('incentive')) return 'wage'
  if (value.includes('income') || value.includes('transfer')) return 'other'

  return 'operating'
}

const mapCashFlow = (payload: CashFlowPayload): CashFlowStatement => {
  let receivedFromCustomers = 0
  let otherOperatingIncome = 0
  let paidForMaterials = 0
  let paidForOpex = 0
  let paidForWages = 0
  let financingInflows = 0
  let capitalExpenditure = 0

  for (const row of payload.breakdown) {
    const kind = refKind(row.referenceType)
    if (row.direction === 'credit') {
      if (kind === 'order') receivedFromCustomers += row.total
      else financingInflows += row.total
    } else {
      if (kind === 'purchase') paidForMaterials += row.total
      else if (kind === 'wage') paidForWages += row.total
      else if (kind === 'expense' || kind === 'operating') paidForOpex += row.total
      else capitalExpenditure += row.total
    }
  }

  otherOperatingIncome = payload.totalInflow - receivedFromCustomers - financingInflows
  const netOperatingCash = receivedFromCustomers + otherOperatingIncome - paidForMaterials - paidForOpex - paidForWages

  return {
    period: {},
    receivedFromCustomers,
    otherOperatingIncome: Math.max(otherOperatingIncome, 0),
    paidForMaterials,
    paidForOpex,
    paidForWages,
    netOperatingCash,
    financingInflows,
    capitalExpenditure,
    netFinancingCash: financingInflows - capitalExpenditure,
    beginningCash: 0,
    netCashIncrease: payload.net,
    endingCash: payload.net,
  }
}

export function useCustomerBalances() {
  const request = useApiFetch<ApiResponse<CustomerEntryRow[]>>('/api/v1/admin/finance/customer-entries', {
    key: 'finance-customer-balances',
    query: { limit: 1000 },
  })
  return {
    items: computed(() => mapCustomerBalances(request.data.value?.data ?? [])),
    pending: request.pending,
    error: request.error,
    refresh: request.refresh,
  }
}

export function useAccountStatements(accountId: Ref<string>, dateRange: Ref<DateRangeValue | null>) {
  const query = computed(() => ({
    accountId: accountId.value || undefined,
    startDate: dateRange.value?.start,
    endDate: dateRange.value?.end,
  }))
  void query

  const rawStatementFetch = useFetch as unknown as (
    url: string | (() => string),
    options?: Record<string, unknown>,
  ) => { data: Ref<unknown>; pending: Ref<boolean>; error: Ref<unknown>; refresh: () => Promise<unknown> }

  const request = rawStatementFetch(
    () => `/api/v1/admin/bank-accounts/${encodeURIComponent(accountId.value || '0')}/statement`,
    { key: 'finance-account-statements', $fetch: apiFetch },
  ) as unknown as {
    data: Ref<ApiResponse<BankStatementPayload> | undefined>
    pending: Ref<boolean>
    error: Ref<unknown>
    refresh: () => Promise<unknown>
  }
  const pending = request.pending
  const error = request.error
  const refresh = request.refresh
  return {
    items: computed(() => mapAccountStatements(accountId.value, request.data.value?.data ?? {
      account: null,
      openingBalance: 0,
      totalCredit: 0,
      totalDebit: 0,
      currentBalance: 0,
      entries: [],
    })),
    pending,
    error,
    refresh,
  }
}

export function useCashFlowStatement(dateRange: Ref<DateRangeValue | null>) {
  const query = computed(() => ({ startDate: dateRange.value?.start, endDate: dateRange.value?.end }))
  const request = useApiFetch<ApiResponse<CashFlowPayload>>('/api/v1/admin/finance/cash-flow', {
    key: 'finance-cash-flow',
    query,
  })
  return {
    statement: computed(() => (request.data.value?.data ? mapCashFlow(request.data.value.data) : undefined)),
    pending: request.pending,
    error: request.error,
    refresh: request.refresh,
  }
}

export function useBalanceSheet(asOfDate: Ref<string>) {
  const query = computed(() => ({ asOfDate: asOfDate.value }))
  const request = useApiFetch<ApiResponse<BalanceSheetStatement>>('/api/v1/admin/finance/balance-sheet', {
    key: 'finance-balance-sheet',
    query,
  })
  return { statement: computed(() => request.data.value?.data), pending: request.pending, error: request.error, refresh: request.refresh }
}