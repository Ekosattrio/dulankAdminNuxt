export type WorkshopServiceCategory = 'printing' | 'laminate' | 'die_cutting' | 'hot_print'
export type WorkshopServiceStatus = 'Active' | 'Deactive'
export type PrintingServiceType = 'Offset' | 'Digital Print' | 'Large Format'

export interface WorkshopService {
  id: string
  storeId: string
  category: WorkshopServiceCategory
  name: string
  status: WorkshopServiceStatus
  updatedAt: string
  printingType?: PrintingServiceType
  maxHeight?: number
  maxWidth?: number
  sizeUnit?: 'cm' | 'mm'
  quantityMinimum?: number
  price?: number
  priceUnit?: 'pcs' | 'box' | 'sheet' | 'cm2' | 'm2'
  druckPrice?: number
  minSize?: string
  maxSize?: string
  pricePerCm?: number
  minimumPrice?: number
  standardPrice?: number
  standardMinimum?: number
  halfCutPrice?: number
  halfCutMinimum?: number
  minimumCalculation?: number
  archivedAt?: string | null
}

export interface WorkshopServiceFormData {
  id?: string
  storeId?: string
  category: WorkshopServiceCategory
  name: string
  printingType?: PrintingServiceType
  maxHeight?: number
  maxWidth?: number
  sizeUnit?: 'cm' | 'mm'
  quantityMinimum?: number
  price?: number
  priceUnit?: 'pcs' | 'box' | 'sheet' | 'cm2' | 'm2'
  druckPrice?: number
  maxSize?: string
  pricePerCm?: number
  minimumPrice?: number
  standardPrice?: number
  standardMinimum?: number
  halfCutPrice?: number
  halfCutMinimum?: number
  minimumCalculation?: number
}
