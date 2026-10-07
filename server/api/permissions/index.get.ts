import { permissionMenuGroups, permissionPages, getDefaultPermissionAction, initialRoles } from '~~/server/utils/userManagementStore'
import type { SystemRole, PermissionAction } from '~~/server/types/user-management'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler((event) => {
  const roles = readJSON<SystemRole[]>('roles.json', initialRoles)
  let matrix = readJSON<Record<string, Record<string, PermissionAction>> | null>('permissions.json', null)

  let isDirty = false
  if (!matrix || Object.keys(matrix).length === 0) {
    matrix = {}
    for (const page of permissionPages) {
      matrix[page] = {}
      for (const role of roles) {
        matrix[page][role.name] = getDefaultPermissionAction(role.name)
      }
    }
    isDirty = true
  } else {
    // Fill in default permissions for any new pages or roles
    for (const page of permissionPages) {
      if (!matrix[page]) {
        matrix[page] = {}
        isDirty = true
      }
      for (const role of roles) {
        if (!matrix[page][role.name]) {
          matrix[page][role.name] = getDefaultPermissionAction(role.name)
          isDirty = true
        }
      }
    }
  }

  if (isDirty) {
    writeJSON('permissions.json', matrix)
  }

  return {
    success: true,
    data: {
      groups: permissionMenuGroups,
      modules: permissionPages,
      roles: roles.map((r) => r.name),
      matrix,
    },
  }
})
