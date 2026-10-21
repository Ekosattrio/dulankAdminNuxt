export interface Department {
  id: string
  name: string
  memberIds?: string[]
  members: string[]
  totalMembers: number
  createdDate: string
  status: 'Active' | 'Inactive'
}

export interface DepartmentFilterParams {
  search?: string
  status?: string
}

export interface DepartmentFormData {
  id?: string
  name: string
  memberIds?: string[]
  members?: string[]
  totalMembers?: number
  createdDate?: string
  status?: 'Active' | 'Inactive'
}

