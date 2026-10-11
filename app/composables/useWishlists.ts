import type { WishlistItem, WishlistStats, WishlistFilterQuery } from '#server/types/wishlist'

interface ResponseData {
  success: boolean
  data: WishlistItem[]
  stats?: WishlistStats
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
}

export function useWishlists(filterParams?: Ref<WishlistFilterQuery> | WishlistFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/webstore/wishlist', {
    key: 'webstore-wishlists-list',
    query: params
  })

  const wishlists = computed<WishlistItem[]>(() =>
    ((data.value?.data ?? []) as unknown as WebstoreRow[]).map(item => ({
      id: String(item.id),
      productName: item.product ?? item.name ?? '',
      userEmail: item.user ?? '',
      category: '',
      price: item.price ?? 0,
      qty: item.quantity ?? 0,
      totalPrice: (item.price ?? 0) * (item.quantity ?? 0),
      date: '',
      status: (item.status ?? 'Active') as WishlistItem['status'],
    })),
  )
  const stats = computed<WishlistStats>(() => data.value?.stats ?? {
    totalWishlistAmount: 0,
    totalWishlistActive: 0,
    totalWishlistCheckout: 0,
    totalWishlistDelete: 0
  })

  return {
    wishlists,
    stats,
    pending,
    error,
    refresh
  }
}
