export interface BannerItem {
  id: string
  title: string
  imageUrl: string
  src?: string
  type?: 'main' | 'product'
  position?: 'Main Slider' | 'Product Promo' | 'main' | 'product' | string
  redirectUrl?: string
  startDate?: string
  endDate?: string
  start?: string
  end?: string
  status?: 'Active' | 'Inactive'
  order?: number
  description?: string
  desc?: string
}

export interface BannerFormData {
  id?: string
  title: string
  imageUrl?: string
  src?: string
  type?: 'main' | 'product'
  position?: string
  redirectUrl?: string
  startDate?: string
  endDate?: string
  start?: string
  end?: string
  status?: 'Active' | 'Inactive'
  order?: number
  description?: string
  desc?: string
}
