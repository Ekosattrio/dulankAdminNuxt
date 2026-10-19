import type { ReviewItem, ReviewStats, ReviewFilterQuery } from '#server/types/review'

interface ResponseData {
  success: boolean
  data: ReviewItem[]
  stats?: ReviewStats
  message?: string
}

export function useReviews(filterParams?: Ref<ReviewFilterQuery> | ReviewFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/webstore/reviews', {
    key: 'webstore-reviews-list',
    query: params
  })

  const reviews = computed<ReviewItem[]>(() => data.value?.data ?? [])

  const { data: statsData, refresh: refreshStats } = useApiFetch<{ success: boolean; data: ReviewStats }>(
    '/api/v1/admin/webstore/reviews/stats',
    { key: 'webstore-reviews-stats' }
  )

  const stats = computed<ReviewStats>(() => statsData.value?.data ?? {
    totalReview: 0,
    totalProduct: 0,
    totalPublish: 0
  })

  return {
    reviews,
    stats,
    pending,
    error,
    refresh,
    refreshStats
  }
}
