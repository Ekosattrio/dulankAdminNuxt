import type { CartItem, CartStats, CartFilterQuery } from '#server/types/cart'

interface ResponseData {
  success: boolean
  data: CartItem[]
  stats?: CartStats
  message?: string
}

interface WebstoreRow {
  id: string | number
  user?: string | null
  product?: string | null
  name?: string | null
  quantity?: number
  price?: number
  status?: string
  customer?: string | null
  date?: string | null
  total?: number
}

export function useCarts(filterParams?: Ref<CartFilterQuery> | CartFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/webstore/carts', {
    key: 'webstore-carts-list',
    query: params
  })

  const carts = computed<CartItem[]>(() =>
    ((data.value?.data ?? []) as unknown as WebstoreRow[]).map(item => ({
      id: String(item.id),
      productName: item.product ?? item.name ?? '',
      userEmail: item.user ?? '',
      category: '',
      price: item.price ?? 0,
      qty: item.quantity ?? 0,
      totalPrice: (item.price ?? 0) * (item.quantity ?? 0),
      date: '',
      status: (item.status ?? 'Active') as CartItem['status'],
    })),
  )
  const stats = computed<CartStats>(() => data.value?.stats ?? {
    totalCartAmount: 0,
    totalCartActive: 0,
    totalCartCheckout: 0,
    totalCartDelete: 0
  })

  return {
    carts,
    stats,
    pending,
    error,
    refresh
  }
}
