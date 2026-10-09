export interface WishlistItem {
  id: string
  customerId?: string
  productId?: string
  productName: string
  productImage?: string
  userEmail: string
  category: string
  price: number
  qty: number
  totalPrice: number
  date: string
  status: 'Active' | 'Checkout' | 'Delete'
}

export interface WishlistStats {
  totalWishlistAmount: number
  totalWishlistActive: number
  totalWishlistCheckout: number
  totalWishlistDelete: number
}

export interface WishlistFilterQuery {
  search?: string
  category?: string
  status?: string
  startDate?: string
  endDate?: string
}
