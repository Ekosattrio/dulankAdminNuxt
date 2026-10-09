import { permissionMenuGroups, permissionPages, getDefaultPermissionAction, initialRoles } from '~~/server/utils/userManagementStore'
import type { SystemRole, PermissionAction } from '~~/server/types/user-management'
import { readJSON } from '~~/server/utils/data'

export default defineEventHandler((event) => {
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
    // Complete the response in memory. GET must never mutate runtime data.
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
    success: true,
    data: {
      groups: permissionMenuGroups,
      modules: permissionPages,
      roles: roles.map((r) => r.name),
      matrix,
    },
  }
})
