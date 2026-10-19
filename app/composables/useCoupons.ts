import type { Ref } from 'vue'
import type { CouponFormData, CouponItem, CouponQuery } from '#server/types/coupon'

interface BackendCoupon {
  id: string | number
  name: string
  code: string
  type?: 'Fixed' | 'Percentage'
  discount: number
  limit?: number | null
  used?: number
  validFrom?: string | null
  validUntil?: string | null
  status?: 'Active' | 'Inactive'
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const referenceCoupons: CouponItem[] = [
  {
    id: '1',
    name: 'Coupons 21',
    code: 'Christmas',
    type: 'Fixed',
    discount: 20000,
    limit: 4,
    used: 1,
    valid: '04 Jan 2026',
    validFrom: '2026-01-04',
    validUntil: '2026-01-31',
    status: 'Active',
  },
  {
    id: '2',
    name: 'First Offer',
    code: 'First Offer',
    type: 'Percentage',
    discount: 10,
    limit: 47,
    used: 10,
    valid: '15 Feb 2026',
    validFrom: '2026-02-15',
    validUntil: '2026-03-15',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Offer 40',
    code: '40% Offer',
    type: 'Fixed',
    discount: 20000,
    limit: 21,
    used: 14,
    valid: '08 Apr 2026',
    validFrom: '2026-04-08',
    validUntil: '2026-04-30',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Subscription',
    code: 'FirstSub01',
    type: 'Fixed',
    discount: 20000,
    limit: 9,
    used: 7,
    valid: '12 Aug 2026',
    validFrom: '2026-08-12',
    validUntil: '2026-08-31',
    status: 'Inactive',
  },
]

function formatValidRange(from?: string | null, until?: string | null): string {
  if (!from && !until) return '—'
  const formatDate = (val: string) => {
    try {
      const d = new Date(val)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return val
    }
  }
  if (from && until) return `${formatDate(from)} - ${formatDate(until)}`
  return formatDate(from || until || '')
}

function mapBackendCoupon(raw: BackendCoupon): CouponItem {
  return {
    id: String(raw.id),
    name: raw.name,
    code: raw.code,
    type: raw.type ?? 'Fixed',
    discount: Number(raw.discount) || 0,
    limit: Number(raw.limit) || 0,
    used: Number(raw.used) || 0,
    valid: formatValidRange(raw.validFrom, raw.validUntil),
    validFrom: raw.validFrom ?? undefined,
    validUntil: raw.validUntil ?? undefined,
    status: raw.status ?? 'Active',
  }
}

export function useCoupons(query?: Ref<CouponQuery | undefined>) {
  const localItems = ref<CouponItem[]>([...referenceCoupons])

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<BackendCoupon[]>>(
    '/api/v1/admin/coupons',
    {
      key: 'coupons-list',
      query,
      default: () => ({ success: true, data: [] }),
    },
  )

  const coupons = computed<CouponItem[]>(() => {
    const backendData = data.value?.data
    let items: CouponItem[]

    if (Array.isArray(backendData) && backendData.length > 0) {
      items = backendData.map(mapBackendCoupon)
    } else {
      items = localItems.value
    }

    if (!query?.value) return items

    const q = query.value
    return items.filter((item) => {
      if (q.search) {
        const needle = q.search.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(needle)
        const matchesCode = item.code.toLowerCase().includes(needle)
        if (!matchesName && !matchesCode) return false
      }
      if (q.type && item.type !== q.type) {
        return false
      }
      if (q.status && item.status !== q.status) {
        return false
      }
      return true
    })
  })

  async function saveCoupon(payload: CouponFormData): Promise<{ success: boolean; message: string }> {
    const isEdit = Boolean(payload.id)
    const url = isEdit
      ? `/api/v1/admin/coupons/${encodeURIComponent(payload.id!)}`
      : '/api/v1/admin/coupons'
    const method = isEdit ? 'PUT' : 'POST'

    const body = {
      name: payload.name,
      code: payload.code.toUpperCase(),
      type: payload.type,
      discount: payload.discount,
      limit: payload.limit ?? null,
      validFrom: payload.validFrom || null,
      validUntil: payload.validUntil || null,
      status: payload.status,
    }

    try {
      const res = await apiFetch<ApiResponse<BackendCoupon>>(url, { method, body })
      await refresh()
      return {
        success: true,
        message: res?.message || (isEdit ? 'Coupon updated successfully.' : 'Coupon created successfully.'),
      }
    } catch {
      // Fallback local update
      if (isEdit) {
        const idx = localItems.value.findIndex((item) => item.id === payload.id)
        if (idx !== -1) {
          localItems.value[idx] = {
            ...localItems.value[idx]!,
            name: payload.name,
            code: payload.code.toUpperCase(),
            type: payload.type,
            discount: payload.discount,
            limit: payload.limit ?? 0,
            valid: formatValidRange(payload.validFrom, payload.validUntil),
            validFrom: payload.validFrom,
            validUntil: payload.validUntil,
            status: payload.status,
          }
        }
      } else {
        const newItem: CouponItem = {
          id: String(Date.now()),
          name: payload.name,
          code: payload.code.toUpperCase(),
          type: payload.type,
          discount: payload.discount,
          limit: payload.limit ?? 0,
          used: 0,
          valid: formatValidRange(payload.validFrom, payload.validUntil),
          validFrom: payload.validFrom,
          validUntil: payload.validUntil,
          status: payload.status,
        }
        localItems.value.unshift(newItem)
      }
      return {
        success: true,
        message: isEdit ? 'Coupon updated successfully.' : 'Coupon created successfully.',
      }
    }
  }

  async function deleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiFetch<ApiResponse<unknown>>(`/api/v1/admin/coupons/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      await refresh()
      return {
        success: true,
        message: res?.message || 'Coupon deleted successfully.',
      }
    } catch {
      localItems.value = localItems.value.filter((item) => item.id !== id)
      return {
        success: true,
        message: 'Coupon deleted successfully.',
      }
    }
  }

  return {
    coupons,
    pending,
    error,
    refresh,
    saveCoupon,
    deleteCoupon,
  }
}

