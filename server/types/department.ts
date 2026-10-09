export interface Department {
  id: string
  name: string
  members: string[]
  totalMembers: number
  createdDate: string
  status: 'Active' | 'Disable'
}

export interface DepartmentFilterParams {
  search?: string
  status?: string
}

export interface DepartmentFormData {
  id?: string
  name: string
  members?: string[]
  totalMembers?: number
  createdDate?: string
  status?: 'Active' | 'Disable'
}

