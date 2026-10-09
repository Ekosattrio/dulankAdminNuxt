export interface CheckoutItem {
  id: string
  customerId?: string
  orderId?: string
  userEmail: string
  dateCheckout: string
  payment: number
  method: string
  status: 'Berhasil' | 'Gagal'
  voucher: string
  deliveryFee: number
  detailProduct: string
}

export interface CheckoutStats {
  totalCheckout: number
  totalRevenue: number
  totalSuccess: number
  totalFailed: number
}

export interface CheckoutFilterQuery {
  search?: string
  method?: string
  status?: string
  startDate?: string
  endDate?: string
}
