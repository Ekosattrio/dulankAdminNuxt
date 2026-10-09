import type { BalanceSheetStatement, BankStatementRow, CashFlowStatement, CustomerBalanceRow } from '#server/types/finance-report'
import type { DateRangeValue } from '~/composables/useDateRange'

interface ApiResponse<T> { success: boolean; data: T }

export function useCustomerBalances() {
  const request = useApiFetch<ApiResponse<CustomerBalanceRow[]>>('/api/finance/customer-balances', { key: 'finance-customer-balances' })
  return { items: computed(() => request.data.value?.data ?? []), pending: request.pending, error: request.error, refresh: request.refresh }
}

export function useAccountStatements(accountId: Ref<string>, dateRange: Ref<DateRangeValue | null>) {
  const query = computed(() => ({ accountId: accountId.value || undefined, startDate: dateRange.value?.start, endDate: dateRange.value?.end }))
  const request = useApiFetch<ApiResponse<BankStatementRow[]>>('/api/finance/account-statements', { key: 'finance-account-statements', query })
  return { items: computed(() => request.data.value?.data ?? []), pending: request.pending, error: request.error, refresh: request.refresh }
}

export function useCashFlowStatement(dateRange: Ref<DateRangeValue | null>) {
  const query = computed(() => ({ startDate: dateRange.value?.start, endDate: dateRange.value?.end }))
  const request = useApiFetch<ApiResponse<CashFlowStatement>>('/api/finance/cash-flow', { key: 'finance-cash-flow', query })
  return { statement: computed(() => request.data.value?.data), pending: request.pending, error: request.error, refresh: request.refresh }
}

export function useBalanceSheet(asOfDate: Ref<string>) {
  const request = useApiFetch<ApiResponse<BalanceSheetStatement>>('/api/finance/balance-sheet', { key: 'finance-balance-sheet', query: computed(() => ({ asOfDate: asOfDate.value })) })
  return { statement: computed(() => request.data.value?.data), pending: request.pending, error: request.error, refresh: request.refresh }
}

