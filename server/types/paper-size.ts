export interface PaperSize {
  id: string
  name: string
  dimension: string
  length: number
  width: number
  unit: string
  update: string
  status: 'Active' | 'Inactive'
}

export interface PaperSizeFilterParams {
  search?: string
  status?: string
}

export interface PaperSizeFormData {
  id?: string
  name: string
  length: number
  width: number
  unit: string
  update?: string
  status: 'Active' | 'Inactive'
}

