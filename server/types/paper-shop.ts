export interface PaperGroupPriceDetail {
  priceType?: 'Fix Price' | 'Sample Price'
  price?: number
  unitPrice?: string
  gramature?: number
  paperSize?: string
}

export interface PaperGroup {
  id: string
  name: string
  merk: string
  priceType: 'Yes' | 'No'
  priceDetail?: PaperGroupPriceDetail
  price?: number
  unitPrice?: string
  gramature?: number
  paperSize?: string
  update: string
  status: 'Active' | 'Deactive'
}

export interface PaperGroupFilterParams {
  search?: string
  status?: string
}

export interface PaperGroupFormData {
  id?: string
  name: string
  merk: string
  priceType: 'Yes' | 'No'
  priceDetail?: PaperGroupPriceDetail
  price?: number
  unitPrice?: string
  gramature?: number
  paperSize?: string
  status: 'Active' | 'Deactive'
}

export interface PaperSize {
  id: string
  name: string
  dimension: string
  length: number
  width: number
  unit: string
  update: string
  status: 'Active' | 'Deactive'
}

export interface PaperSizeFilterParams {
  search?: string
  status?: string
}

export interface PaperSizeFormData {
  id?: string
  name: string
  dimension?: string
  length: number
  width: number
  unit: string
  status: 'Active' | 'Deactive'
}

export interface PaperStockHistoryItem {
  date: string
  reff: string
  qty: number
  unit: string
  created: string
}

export interface PaperItem {
  id: string
  groupId: string
  sizeId?: string
  name: string
  merk: string
  price: number
  priceType: string
  unitPrice: string
  gsm: number
  paperSize: string
  paperWidth?: number
  paperHeight?: number
  stock: number
  unitStock: string
  minOrder?: string
  stepOrder?: string
  minTransaction?: number
  stockHistory?: PaperStockHistoryItem[]
  update: string
  status: 'Active' | 'Deactive'
}

export interface PaperItemFilterParams {
  search?: string
  status?: string
  groupId?: string
}

export interface PaperItemFormData {
  id?: string
  groupId: string
  sizeId?: string
  name: string
  merk: string
  price: number
  priceType: string
  unitPrice: string
  gsm: number
  paperSize: string
  paperWidth?: number
  paperHeight?: number
  stock: number
  unitStock: string
  minOrder?: string
  stepOrder?: string
  minTransaction?: number
  addStock?: number
  status: 'Active' | 'Deactive'
}

export interface PaperPrice {
  id: string
  paperId?: string
  groupId?: string
  nama: string
  group: string
  merk: string
  panjang?: number
  lebar?: number
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  kelipatan: string
  harga: number
  update: string
  status: 'Active' | 'Deactive'
}

export interface PaperPriceFilterParams {
  search?: string
  status?: string
  group?: string
}

export interface PaperPriceFormData {
  id?: string
  paperId?: string
  groupId?: string
  nama: string
  group: string
  merk: string
  panjang?: number
  lebar?: number
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  minOrderUnit?: 'Rim' | 'Lembar'
  kelipatan: string
  kelipatanUnit?: 'Rim' | 'Lembar'
  harga: number
  hargaUnit?: 'Rim' | 'Lembar'
  status: 'Active' | 'Deactive'
}

