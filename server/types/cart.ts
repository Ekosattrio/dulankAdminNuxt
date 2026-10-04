export interface CartItem {
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

export interface CartStats {
  totalCartAmount: number
  totalCartActive: number
  totalCartCheckout: number
  totalCartDelete: number
}

export interface CartFilterQuery {
  search?: string
  category?: string
  status?: string
  startDate?: string
  endDate?: string
}
