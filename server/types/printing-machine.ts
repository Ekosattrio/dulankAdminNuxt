export interface PrintingMachine {
  id: string
  type: 'Offset' | 'Digital Printing'
  name: string
  colors: number
  maxArea: string
  plateCost: number
  minim: number
  druck: number
  update: string
  status: 'Active' | 'Inactive'
}

export interface PrintingMachineFilterParams {
  search?: string
  type?: string
  status?: string
}

export interface PrintingMachineFormData {
  id?: string
  type: 'Offset' | 'Digital Printing'
  name: string
  colors: number
  maxArea: string
  plateCost: number
  minim: number
  druck: number
  update?: string
  status: 'Active' | 'Inactive'
}

