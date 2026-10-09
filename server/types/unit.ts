export interface Unit {
  id: string
  name: string
  shortName: string
  itemUsed: number
  createdOn: string
  status: 'Active' | 'Inactive'
}

export interface UnitFilterParams {
  search?: string
  status?: string
}

export interface UnitFormData {
  id?: string
  name: string
  shortName: string
  status?: 'Active' | 'Inactive'
}

