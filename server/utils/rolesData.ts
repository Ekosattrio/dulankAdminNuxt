import { initialRoles, permissionMenuGroups, permissionPages, getDefaultPermissionAction } from './userManagementStore'
import type { SystemRole, PermissionAction } from '~~/server/types/user-management'
import { readJSON, writeJSON } from './data'

const ROLES_FILE = 'roles.json'

export function getRoles(filter?: { search?: string; sort?: string }): SystemRole[] {
  const roles = readJSON<SystemRole[]>(ROLES_FILE, initialRoles)
  let result = [...roles]

  if (filter?.search) {
    const q = filter.search.trim().toLowerCase()
    result = result.filter((r) => r.name.toLowerCase().includes(q))
  }

  if (filter?.sort === 'oldest') {
    result.reverse()
  }

  return result
}

export function saveRole(payload: Partial<SystemRole> & { name: string }): { role: SystemRole; isNew: boolean } {
  if (!payload.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role Name is required',
    })
  }

  const roles = readJSON<SystemRole[]>(ROLES_FILE, initialRoles)
  const existingIdx = payload.id ? roles.findIndex((r) => r.id === payload.id) : -1

  if (existingIdx !== -1) {
    const current = roles[existingIdx]
    if (!current) throw createError({ statusCode: 404, statusMessage: 'Role not found' })
    const updated: SystemRole = {
      ...current,
      name: payload.name.trim(),
      description: payload.description !== undefined ? payload.description : (current.description || ''),
    }
    roles[existingIdx] = updated
    writeJSON(ROLES_FILE, roles)
    return { role: updated, isNew: false }
  } else {
    const today = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
    const newRole: SystemRole = {
      id: payload.id || `role-${Date.now()}`,
      name: payload.name.trim(),
      createdOn: today,
      description: payload.description || '',
    }
    roles.unshift(newRole)
    writeJSON(ROLES_FILE, roles)
    return { role: newRole, isNew: true }
  }
}

export function deleteRole(id: string): SystemRole {
  const roles = readJSON<SystemRole[]>(ROLES_FILE, initialRoles)
  const idx = roles.findIndex((r) => r.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Role not found',
    })
  }

  const removed = roles[idx]
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Role not found' })
  const remaining = roles.filter((r) => r.id !== id)
  writeJSON(ROLES_FILE, remaining)
  return removed
}

// ----------------- Permissions Matrix -----------------

export function getPermissionsMatrix() {
  const roles = readJSON<SystemRole[]>('roles.json', initialRoles)
  let matrix = readJSON<Record<string, Record<string, PermissionAction>> | null>('permissions.json', null)

  if (!matrix || Object.keys(matrix).length === 0) {
    matrix = {}
    for (const page of permissionPages) {
      matrix[page] = {}
      for (const role of roles) {
        matrix[page][role.name] = getDefaultPermissionAction(role.name)
      }
    }
  } else {
    for (const page of permissionPages) {
      if (!matrix[page]) {
        matrix[page] = {}
      }
      for (const role of roles) {
        if (!matrix[page][role.name]) {
          matrix[page][role.name] = getDefaultPermissionAction(role.name)
        }
      }
    }
  }

  return {
    groups: permissionMenuGroups,
    modules: permissionPages,
    roles: roles.map((r: SystemRole) => r.name),
    matrix,
  }
}

export function savePermissionsMatrix(payload: any) {
  const matrix = (payload && typeof payload === 'object' && 'matrix' in payload) ? payload.matrix : payload

  if (!matrix || typeof matrix !== 'object' || Object.keys(matrix).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Permissions matrix payload is required',
    })
  }

  writeJSON('permissions.json', matrix)
  return matrix
}

