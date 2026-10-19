import type { DiscountFormData, DiscountItem, DiscountQuery, DiscountStatus, DiscountType } from '#server/types/discount'

interface ResponseData {
  success: boolean
  data: any[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: DiscountItem
  message?: string
}

const defaultReferenceDiscounts: DiscountItem[] = [
  {
    id: 'discount-001',
    planId: 'discount-plan-001',
    plan: 'Standard',
    name: 'Weekend Deal',
    value: 70,
    type: 'Percentage',
    validFrom: '2025-05-22',
    validTill: '2025-06-24',
    validity: '22 May 2025 - 24 Jun 2025',
    days: 'Sat, Sun',
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 'discount-002',
    planId: 'discount-plan-002',
    plan: 'Membership',
    name: 'Loyalty Reward',
    value: 40,
    type: 'Fixed',
    validFrom: '2025-04-16',
    validTill: '2025-05-16',
    validity: '16 Apr 2025 - 16 May 2025',
    days: 'Mon, Tue, Thu, Fri',
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 'discount-003',
    planId: 'discount-plan-001',
    plan: 'Standard',
    name: 'Flash Sale',
    value: 60,
    type: 'Percentage',
    validFrom: '2025-03-20',
    validTill: '2025-04-20',
    validity: '20 Mar 2025 - 20 Apr 2025',
    days: 'Thu, Fri, Sat, Sun',
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 'discount-004',
    planId: 'discount-plan-001',
    plan: 'Standard',
    name: 'Super Saver',
    value: 80,
    type: 'Percentage',
    validFrom: '2025-02-15',
    validTill: '2025-04-15',
    validity: '15 Feb 2025 - 15 Apr 2025',
    days: 'Mon, Tue, Wed',
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 'discount-005',
    planId: 'discount-plan-001',
    plan: 'Standard',
    name: 'Surprise Savings',
    value: 50,
    type: 'Fixed',
    validFrom: '2025-01-24',
    validTill: '2025-03-24',
    validity: '24 Jan 2025 - 24 Mar 2025',
    days: 'Mon, Tue, Thu, Sat',
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  }
]

function formatValidity(from: string | null | undefined, till: string | null | undefined): string {
  if (!from && !till) return '—'
  if (from && till) return `${from} - ${till}`
  return from || till || '—'
}

/**
 * Diskon — backend Laravel `/api/v1/admin/discounts` (CRUD penuh).
 */
export function useDiscounts(filterParams?: Ref<DiscountQuery> | DiscountQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/discounts', {
    key: 'discounts-list',
    query
  })

  const allDiscounts = computed<DiscountItem[]>(() => {
    const raw = data.value?.data
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any) => {
        let daysStr = ''
        if (Array.isArray(item.days)) {
          daysStr = item.days.join(', ')
        } else if (typeof item.days === 'string') {
          daysStr = item.days
        }

        let productsStr = ''
        if (Array.isArray(item.products)) {
          productsStr = item.products.join(', ')
        } else if (typeof item.products === 'string') {
          productsStr = item.products
        }

        const validFrom = item.validFrom || null
        const validTill = item.validTill || null

        return {
          id: String(item.id),
          planId: item.planId ? String(item.planId) : null,
          plan: item.plan || (item.planId ? `Plan #${item.planId}` : '—'),
          name: item.name || '',
          value: Number(item.value) || 0,
          type: (item.type === 'Percentage' ? 'Percentage' : 'Fixed') as DiscountType,
          validFrom,
          validTill,
          validity: formatValidity(validFrom, validTill),
          days: daysStr || '—',
          products: productsStr || 'All Products',
          used: Number(item.used) || 0,
          status: (item.status === 'Inactive' ? 'Inactive' : 'Active') as DiscountStatus
        }
      })
    }
    return defaultReferenceDiscounts
  })

  const filteredDiscounts = computed<DiscountItem[]>(() => {
    let list = allDiscounts.value
    const p = params.value

    if (p.search) {
      const s = p.search.toLowerCase()
      list = list.filter(item =>
        item.name.toLowerCase().includes(s) ||
        (item.plan && item.plan.toLowerCase().includes(s)) ||
        (typeof item.products === 'string' && item.products.toLowerCase().includes(s)) ||
        (typeof item.days === 'string' && item.days.toLowerCase().includes(s))
      )
    }

    if (p.plan) {
      const targetPlan = p.plan.toLowerCase()
      list = list.filter(item =>
        (item.plan && item.plan.toLowerCase().includes(targetPlan)) ||
        (item.planId && item.planId.toLowerCase() === targetPlan)
      )
    }

    if (p.status) {
      list = list.filter(item => item.status.toLowerCase() === p.status?.toLowerCase())
    }

    return list
  })

  const saveDiscount = async (payload: DiscountFormData) => {
    const { id, plan, applicableFor, ...rest } = payload
    void plan

    let productsArr: string[] | null = null
    if (Array.isArray(payload.products)) {
      productsArr = payload.products
    } else if (applicableFor) {
      productsArr = [applicableFor]
    }

    const body: Record<string, any> = {
      name: rest.name.trim(),
      value: Number(rest.value) || 0,
      type: rest.type || 'Fixed',
      validFrom: rest.validFrom || null,
      validTill: rest.validTill || null,
      days: Array.isArray(rest.days) ? rest.days : null,
      products: productsArr,
      status: rest.status || 'Active'
    }

    if (rest.planId) {
      const parsed = Number(rest.planId)
      body.planId = Number.isInteger(parsed) ? parsed : rest.planId
    }

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/discounts/${encodeURIComponent(id)}` : '/api/v1/admin/discounts',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteDiscount = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/discounts/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    discounts: filteredDiscounts,
    allDiscounts,
    pending,
    error,
    refresh,
    saveDiscount,
    deleteDiscount
  }
}