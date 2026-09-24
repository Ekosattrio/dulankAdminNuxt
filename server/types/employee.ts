export interface EmployeeItem {
  id: string
  name: string
  department: string
  address: string
  detailAddress?: string
  phone: string
  joinDate: string
  status: 'Active' | 'Resign' | 'Inactive'
  gender?: string
  dob?: string
  joinChannel?: string
  contact1Name?: string
  contact1Phone?: string
  contact2Name?: string
  contact2Phone?: string
  email?: string
}

export interface EmployeeFilterParams {
  search?: string
  department?: string
  status?: string
}

export interface EmployeeFormData {
  id?: string
  name: string
  department: string
  address: string
  detailAddress?: string
  phone: string
  joinDate?: string
  status?: 'Active' | 'Resign' | 'Inactive'
  gender?: string
  dob?: string
  joinChannel?: string
  contact1Name?: string
  contact1Phone?: string
  contact2Name?: string
  contact2Phone?: string
  email?: string
}

