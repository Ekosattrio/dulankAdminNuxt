export interface ClientItem {
  id: string
  name: string
  logoUrl?: string
  svgPath?: string
  viewBox?: string
  fillRule?: 'evenodd' | 'nonzero'
  website?: string
  category: string
  status: 'Active' | 'Inactive'
  order: number
  createdDate?: string
}

export interface ClientFormData {
  id?: string
  name: string
  logoUrl?: string
  svgPath?: string
  viewBox?: string
  website?: string
  category?: string
  status?: 'Active' | 'Inactive'
  order?: number
}
