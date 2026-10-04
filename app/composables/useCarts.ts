import type { CartItem, CartStats, CartFilterQuery } from '#server/types/cart'

interface ResponseData {
  success: boolean
  data: CartItem[]
  stats?: CartStats
  message?: string
}

export function useCarts(filterParams?: Ref<CartFilterQuery> | CartFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/webstore/cart', {
    key: 'webstore-carts-list',
    query: params
  })

  const carts = computed<CartItem[]>(() => data.value?.data ?? [])
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
