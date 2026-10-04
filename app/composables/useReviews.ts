import type { ReviewItem, ReviewStats, ReviewFilterQuery } from '#server/types/review'

interface ResponseData {
  success: boolean
  data: ReviewItem[]
  stats?: ReviewStats
  message?: string
}

export function useReviews(filterParams?: Ref<ReviewFilterQuery> | ReviewFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/webstore/reviews', {
    key: 'webstore-reviews-list',
    query: params
  })

  const reviews = computed<ReviewItem[]>(() => data.value?.data ?? [])
  const stats = computed<ReviewStats>(() => data.value?.stats ?? {
    totalReview: 0,
    totalProduct: 0,
    totalPublish: 0
  })

  return {
    reviews,
    stats,
    pending,
    error,
    refresh
  }
}
