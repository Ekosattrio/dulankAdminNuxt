export interface ReviewItem {
  id: string
  customerId?: string
  productId: string
  productName: string
  userEmail: string
  date: string
  rating: number
  title: string
  review: string
  status: 'Publish' | 'Unpublish'
}

export interface ReviewStats {
  totalReview: number
  totalProduct: number
  totalPublish: number
}

export interface ReviewFilterQuery {
  search?: string
  rating?: string | number
  startDate?: string
  endDate?: string
}
