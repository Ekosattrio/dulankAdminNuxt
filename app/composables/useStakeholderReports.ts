import type {
  SupplierReportItem,
  SupplierDueReportItem,
  CustomerReportItem,
  CustomerDueReportItem,
} from '~~/server/types/reports-stakeholders'
import { isDateInRange, type DateRangeValue } from '~/composables/useDateRange'

export interface StakeholderApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useSupplierReport() {
  const search = ref('')
  const status = ref('')
  const category = ref('')
  const dateRange = ref<DateRangeValue | null>(null)

  const { data, pending, error, refresh } = useApiFetch<StakeholderApiResponse<SupplierReportItem[]>>('/api/reports/suppliers', {
    key: 'reports-suppliers-list',
  })

  const rawItems = computed<SupplierReportItem[]>(() => data.value?.data ?? [])

  const items = computed<SupplierReportItem[]>(() => {
    let list = rawItems.value
    if (status.value && status.value !== 'All' && status.value !== 'All Status' && status.value !== '') {
      list = list.filter((i) => i.status?.toLowerCase() === status.value.toLowerCase())
    }
    if (category.value && category.value !== 'All' && category.value !== 'All Categories' && category.value !== '') {
      list = list.filter((i) => i.category?.toLowerCase() === category.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.date, dateRange.value))
    }
    return list
  })

  const stats = computed(() => {
    const list = items.value
    const uniqueSuppliers = new Set(list.map((i) => i.supplierName).filter(Boolean))
    const totalSuppliers = uniqueSuppliers.size
    const totalTransactions = list.length
    const totalAmount = list.reduce((sum, item) => sum + (item.amount || 0), 0)
    const totalPaid = list.reduce((sum, item) => sum + (item.totalPaid || (item.status === 'Received' ? item.amount : 0)), 0)
    const totalDue = list.reduce((sum, item) => sum + (item.balanceDue || (item.status !== 'Received' ? item.amount : 0)), 0)
    return {
      totalSuppliers,
      totalTransactions,
      totalAmount,
      totalPaid,
      totalDue,
    }
  })

  return {
    items,
    rawItems,
    search,
    status,
    category,
    dateRange,
    pending,
    error,
    refresh,
    stats,
  }
}

export function useSupplierDueReport() {
  const search = ref('')
  const status = ref('')
  const category = ref('')
  const dateRange = ref<DateRangeValue | null>(null)

  const { data, pending, error, refresh } = useApiFetch<StakeholderApiResponse<SupplierDueReportItem[]>>('/api/reports/supplier-dues', {
    key: 'reports-supplier-dues-list',
  })

  const rawItems = computed<SupplierDueReportItem[]>(() => data.value?.data ?? [])

  const items = computed<SupplierDueReportItem[]>(() => {
    let list = rawItems.value
    if (status.value && status.value !== 'All' && status.value !== 'All Status' && status.value !== '') {
      list = list.filter((i) => i.status?.toLowerCase() === status.value.toLowerCase())
    }
    if (category.value && category.value !== 'All' && category.value !== 'All Categories' && category.value !== '') {
      list = list.filter((i) => i.category?.toLowerCase() === category.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.purchasesDue ? String(i.purchasesDue) : '', dateRange.value))
    }
    return list
  })

  const stats = computed(() => {
    const list = items.value
    const uniqueSuppliers = new Set(list.map((i) => i.supplierName).filter(Boolean))
    const totalSuppliers = uniqueSuppliers.size
    const totalOrdersDue = list.reduce((sum, item) => sum + (item.purchasesDue || 0), 0)
    const totalAmountDue = list.reduce((sum, item) => sum + (item.amountDue || 0), 0)
    const totalPaid = list.reduce((sum, item) => {
      const histPaid = item.history ? item.history.reduce((hSum, h) => hSum + (h.paid || 0), 0) : 0
      return sum + histPaid
    }, 0)
    const dueItems = list.filter((i) => typeof i.daysDue === 'number')
    const avgDaysDue = dueItems.length
      ? Math.round(dueItems.reduce((sum, item) => sum + (item.daysDue || 0), 0) / dueItems.length)
      : 0
    return {
      totalSuppliers,
      totalPurchasesDue: totalOrdersDue,
      totalAmountDue,
      totalPaid,
      avgDaysDue,
    }
  })

  return {
    items,
    rawItems,
    search,
    status,
    category,
    dateRange,
    pending,
    error,
    refresh,
    stats,
  }
}

export function useCustomerReport() {
  const search = ref('')
  const status = ref('')
  const paymentMethod = ref('')
  const dateRange = ref<DateRangeValue | null>(null)

  const { data, pending, error, refresh } = useApiFetch<StakeholderApiResponse<CustomerReportItem[]>>('/api/reports/customers', {
    key: 'reports-customers-list',
  })

  const rawItems = computed<CustomerReportItem[]>(() => data.value?.data ?? [])

  const items = computed<CustomerReportItem[]>(() => {
    let list = rawItems.value
    if (status.value && status.value !== 'All' && status.value !== 'All Status' && status.value !== '') {
      list = list.filter((i) => i.status?.toLowerCase() === status.value.toLowerCase())
    }
    if (paymentMethod.value && paymentMethod.value !== 'All' && paymentMethod.value !== 'All Methods' && paymentMethod.value !== '') {
      list = list.filter((i) => i.paymentMethod?.toLowerCase() === paymentMethod.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.date || '', dateRange.value))
    }
    return list
  })

  const stats = computed(() => {
    const list = items.value
    const totalCustomers = list.length
    const totalOrders = list.reduce((sum, item) => sum + (item.totalOrder || 0), 0)
    const totalAmount = list.reduce((sum, item) => sum + (item.amount || 0), 0)
    const totalPaid = list.reduce((sum, item) => sum + (item.totalPaid || 0), 0)
    const totalDue = list.reduce((sum, item) => sum + (item.balanceDue || 0), 0)
    return {
      totalCustomers,
      totalOrders,
      totalAmount,
      totalPaid,
      totalDue,
    }
  })

  return {
    items,
    rawItems,
    search,
    status,
    paymentMethod,
    dateRange,
    pending,
    error,
    refresh,
    stats,
  }
}

export function useCustomerDueReport() {
  const search = ref('')
  const status = ref('')
  const paymentMethod = ref('')
  const dateRange = ref<DateRangeValue | null>(null)

  const { data, pending, error, refresh } = useApiFetch<StakeholderApiResponse<CustomerDueReportItem[]>>('/api/reports/customer-dues', {
    key: 'reports-customer-dues-list',
  })

  const rawItems = computed<CustomerDueReportItem[]>(() => data.value?.data ?? [])

  const items = computed<CustomerDueReportItem[]>(() => {
    let list = rawItems.value
    if (status.value && status.value !== 'All' && status.value !== 'All Status' && status.value !== '') {
      list = list.filter((i) => i.status?.toLowerCase() === status.value.toLowerCase())
    }
    if (paymentMethod.value && paymentMethod.value !== 'All' && paymentMethod.value !== 'All Methods' && paymentMethod.value !== '') {
      list = list.filter((i) => i.paymentMethod?.toLowerCase() === paymentMethod.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.date || '', dateRange.value))
    }
    return list
  })

  const stats = computed(() => {
    const list = items.value
    const totalCustomers = list.length
    const totalOrdersDue = list.reduce((sum, item) => sum + (item.orderDue || 0), 0)
    const totalAmountDue = list.reduce((sum, item) => sum + (item.amountDue || 0), 0)
    const totalOverdue = list.reduce((sum, item) => sum + (item.overdueAmount || item.amountDue || 0), 0)
    const dueItems = list.filter((i) => typeof i.daysDue === 'number')
    const avgDaysDue = dueItems.length
      ? Math.round(dueItems.reduce((sum, item) => sum + (item.daysDue || 0), 0) / dueItems.length)
      : 0
    return {
      totalCustomers,
      totalOrdersDue,
      totalAmountDue,
      totalOverdue,
      avgDaysDue,
    }
  })

  return {
    items,
    rawItems,
    search,
    status,
    paymentMethod,
    dateRange,
    pending,
    error,
    refresh,
    stats,
  }
}

export function useStakeholderReports(type: 'supplier' | 'supplier-due' | 'customer' | 'customer-due' = 'supplier') {
  if (type === 'supplier-due') return useSupplierDueReport()
  if (type === 'customer') return useCustomerReport()
  if (type === 'customer-due') return useCustomerDueReport()
  return useSupplierReport()
}
