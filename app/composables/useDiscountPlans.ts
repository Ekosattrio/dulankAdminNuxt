import type { DiscountPlanCommand, DiscountPlanCustomerSegment, DiscountPlanMeta, DiscountPlanQuery, DiscountPlanStatus, DiscountPlanView } from '#server/types/discount-plan'
import type { CustomerType } from '#server/types/customer-type'

interface ListResponse {
  success: boolean
  data: any[]
  meta?: DiscountPlanMeta
}

interface CustomerTypesResponse {
  success: boolean
  data: CustomerType[]
}

const defaultSegments: DiscountPlanCustomerSegment[] = [
  { id: 'All Customers', name: 'All Customers', filterLabel: 'All Customer', availableInFilter: true, availableInForm: true },
  { id: 'Members Only', name: 'Members Only', filterLabel: 'Members Only', availableInFilter: true, availableInForm: true },
  { id: 'High-Spending Customers', name: 'High-Spending Customers', filterLabel: 'High-Spending Customers', availableInFilter: true, availableInForm: true },
  { id: 'Online Customers', name: 'Online Customers', filterLabel: 'Online Customers', availableInFilter: true, availableInForm: true },
  { id: 'Students', name: 'Students', filterLabel: 'Students', availableInFilter: false, availableInForm: true }
]

const defaultReferencePlans: DiscountPlanView[] = [
  { id: 'discount-plan-001', name: 'Standard Plan', customers: 'All Customers', customerSegmentId: 'All Customers', status: 'Active' },
  { id: 'discount-plan-002', name: 'Membership Plan', customers: 'Members Only', customerSegmentId: 'Members Only', status: 'Active' },
  { id: 'discount-plan-003', name: 'Premium Plan', customers: 'High-Spending Customers', customerSegmentId: 'High-Spending Customers', status: 'Active' },
  { id: 'discount-plan-004', name: 'Seasonal Plan', customers: 'All Customers', customerSegmentId: 'All Customers', status: 'Active' },
  { id: 'discount-plan-005', name: 'Student Plan', customers: 'Students', customerSegmentId: 'Students', status: 'Active' },
  { id: 'discount-plan-006', name: 'Free Shipping Plan', customers: 'Online Customers', customerSegmentId: 'Online Customers', status: 'Active' },
  { id: 'discount-plan-007', name: 'Celebration Plan', customers: 'All Customers', customerSegmentId: 'All Customers', status: 'Active' }
]

export function useDiscountPlans(query: Ref<DiscountPlanQuery>) {
  const apiQuery = computed(() => ({
    search: query.value.search || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ListResponse>('/api/v1/admin/discount-plans', {
    key: 'discount-plan-list',
    query: apiQuery
  })

  const { data: customerTypesData, refresh: refreshCustomerTypes } = useApiFetch<CustomerTypesResponse>('/api/v1/admin/customer-types', {
    key: 'discount-plan-customer-types-list',
    query: { limit: 100 }
  })

  const meta = computed<DiscountPlanMeta>(() => {
    const customTypes: DiscountPlanCustomerSegment[] = (customerTypesData.value?.data || []).map(ct => ({
      id: ct.name,
      name: ct.name,
      filterLabel: ct.name,
      availableInFilter: true,
      availableInForm: true
    }))

    const formMap = new Map<string, DiscountPlanCustomerSegment>()
    for (const seg of defaultSegments) {
      if (seg.availableInForm) formMap.set(seg.name, seg)
    }
    for (const ct of customTypes) {
      formMap.set(ct.name, ct)
    }

    const filterMap = new Map<string, DiscountPlanCustomerSegment>()
    for (const seg of defaultSegments) {
      if (seg.availableInFilter) filterMap.set(seg.name, seg)
    }
    for (const ct of customTypes) {
      filterMap.set(ct.name, ct)
    }

    return {
      filterCustomerSegments: Array.from(filterMap.values()),
      formCustomerSegments: Array.from(formMap.values())
    }
  })

  const allPlans = computed<DiscountPlanView[]>(() => {
    const rawList = data.value?.data
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item: any) => {
        let customerStr = ''
        if (Array.isArray(item.customers)) {
          customerStr = item.customers.join(', ')
        } else if (typeof item.customers === 'string') {
          customerStr = item.customers
        }
        return {
          id: String(item.id),
          name: item.name || '',
          customers: customerStr || 'All Customers',
          customerSegmentId: customerStr || 'All Customers',
          discountCount: item.discountCount ?? 0,
          status: (item.status === 'Inactive' ? 'Inactive' : 'Active') as DiscountPlanStatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      })
    }
    return defaultReferencePlans
  })

  const filteredPlans = computed<DiscountPlanView[]>(() => {
    let list = allPlans.value
    const q = query.value

    if (q.search) {
      const s = q.search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.customers.toLowerCase().includes(s))
    }

    if (q.customerSegmentId) {
      const target = q.customerSegmentId.toLowerCase()
      list = list.filter(p => {
        const c = p.customers.toLowerCase()
        if (target === 'all customer' || target === 'all customers') {
          return c.includes('all customer')
        }
        return c.includes(target)
      })
    }

    if (q.status) {
      list = list.filter(p => p.status.toLowerCase() === q.status?.toLowerCase())
    }

    return list
  })

  async function createPlan(command: DiscountPlanCommand) {
    const customerName = command.customer || command.customerSegmentId || (command.customers && command.customers[0]) || 'All Customers'
    const body = {
      name: command.name.trim(),
      customers: [customerName],
      status: command.status || 'Active'
    }
    const response = await apiFetch<{ success: boolean; data: any; message?: string }>('/api/v1/admin/discount-plans', {
      method: 'POST',
      body
    })
    await refresh()
    return {
      success: true,
      data: response.data,
      message: response.message || 'Discount plan created successfully'
    }
  }

  async function updatePlan(id: string, command: DiscountPlanCommand) {
    const customerName = command.customer || command.customerSegmentId || (command.customers && command.customers[0]) || 'All Customers'
    const body = {
      name: command.name.trim(),
      customers: [customerName],
      status: command.status || 'Active'
    }
    const response = await apiFetch<{ success: boolean; data: any; message?: string }>(`/api/v1/admin/discount-plans/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body
    })
    await refresh()
    return {
      success: true,
      data: response.data,
      message: response.message || 'Discount plan updated successfully'
    }
  }

  async function deletePlan(id: string) {
    const response = await apiFetch<{ success: boolean; data?: any; message?: string }>(`/api/v1/admin/discount-plans/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return {
      success: true,
      data: response.data,
      message: response.message || 'Discount plan deleted successfully'
    }
  }

  async function createCustomer(name: string) {
    const response = await apiFetch<{ success: boolean; data?: { id: string; name: string }; message?: string }>('/api/v1/admin/customer-types', {
      method: 'POST',
      body: { name: name.trim(), status: 'Active' }
    })
    await refreshCustomerTypes()
    await refresh()
    const customerName = response.data?.name || name.trim()
    return {
      success: true,
      data: {
        id: customerName,
        name: customerName,
        filterLabel: customerName,
        availableInFilter: true,
        availableInForm: true
      },
      message: response.message || 'Customer added successfully'
    }
  }

  return {
    plans: filteredPlans,
    allPlans,
    meta,
    pending,
    error,
    refresh,
    createPlan,
    updatePlan,
    deletePlan,
    createCustomer
  }
}

