export interface Designation {
  id: string
  name: string
  members: string[]
  createdOn: string
  totalMembers: number
  status: 'Active' | 'Inactive'
}

export interface DesignationFilterParams {
  search?: string
  status?: string
}

export interface DesignationFormData {
  id?: string
  name: string
  members?: string[]
  totalMembers?: number
  createdOn?: string
  status?: 'Active' | 'Inactive'
}

