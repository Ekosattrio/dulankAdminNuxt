// paper.ts — type/interface untuk domain paper (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface PaperGroupItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  name: string
  merk: string
  update: string
  status: 'Active' | 'Inactive'
  isPublic: boolean
}

export interface PaperSizeItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  name: string
  dimension: string
  unit: string
  update: string
}

export interface PaperTypeItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  update: string
}

export interface SelfPaperGroup {
  id: number
  name: string
  merk: string
  priceType: 'Yes' | 'No'
  update: string
  status: 'Active' | 'Deactive'
}

export interface SelfPaperPrice {
  id: number
  nama: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  kelipatan: string
  harga: number
  update: string
  status: 'Active' | 'Inactive'
}

export interface SelfPaperSize {
  id: number
  name: string
  dimension: string
  length: number
  width: number
  unit: string
  update: string
  status: 'Active' | 'Inactive'
}

export interface SelfPaperType {
  id: number
  name: string
  merk: string
  price: number
  priceType: string
  unitPrice: string
  gsm: number
  size: string
  stock: number
  unitStock: string
  status: 'Active' | 'Inactive'
}

export interface VendorPaperPrice {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  nama: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  kelipatan: string
  harga: number
  update: string
}
