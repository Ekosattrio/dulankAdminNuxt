export interface JasaLainItem {
  id: string
  name: string
  harga: number
  minimHarga: number
  satuan: string
  status: 'Active' | 'Deactive'
  updatedAt?: string
}

export interface JasaLainFormData {
  id?: string
  name: string
  harga: number
  minimHarga: number
  satuan: string
  status?: 'Active' | 'Deactive'
}

export interface KomponenMinimumItem {
  id: string
  name: string
  rate: number
  minim: number
  unit: string
  used: number
  update: string
  status: 'Active' | 'Deactive'
}

export interface KomponenMinimumFormData {
  id?: string
  name: string
  rate: number
  minim: number
  unit: string
  used?: number
  status?: 'Active' | 'Deactive'
}

export interface KomponenFiksItem {
  id: string
  name: string
  value: number
  unit: string
  used: number
  update: string
  status: 'Active' | 'Deactive'
}

export interface KomponenFiksFormData {
  id?: string
  name: string
  value: number
  unit: string
  used?: number
  status?: 'Active' | 'Deactive'
}

