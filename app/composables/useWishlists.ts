import type { WishlistItem, WishlistStats, WishlistFilterQuery } from '#server/types/wishlist'

interface ResponseData {
  success: boolean
  data: WishlistItem[]
  stats?: WishlistStats
  message?: string
}

export function useWishlists(filterParams?: Ref<WishlistFilterQuery> | WishlistFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/webstore/wishlist', {
    key: 'webstore-wishlists-list',
    query: params
  })

  const wishlists = computed<WishlistItem[]>(() => data.value?.data ?? [])
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
