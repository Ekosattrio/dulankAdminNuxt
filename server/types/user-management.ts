export interface MemberUser {
  id: string
  customerId: string
  name: string
  email: string
  verifiedEmail: boolean
  subscription: boolean
  status: 'Active Member' | 'Suspended'
  phone?: string
  avatar?: string
  createdAt?: string
}

export interface UserAdmin {
  id: string
  userId: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Supervisor' | 'Staff'
  stores: string[]
  status: 'Active' | 'Inactive'
  phone?: string
  avatar?: string
  descriptions?: string
  createdAt?: string
}

export interface SystemRole {
  id: string
  name: string
  createdOn: string
  description?: string
}

export interface PermissionAction {
  create: boolean
  edit: boolean
  delete: boolean
  view: boolean
  allowAll: boolean
}

export interface PermissionMenuGroup {
  group: string
  pages: string[]
}

export interface PermissionGroup {
  group: string
  pages: string[]
}

export interface ModulePermission {
  module: string
  category?: string
  permissions: Record<string, PermissionAction> // key: role name (e.g. 'Admin', 'Owner', 'Manager')
}

export interface DeleteAccountRequest {
  id: string
  email: string
  userName: string
  avatar: string
  requisitionDate: string
  deleteRequestDate: string
}
