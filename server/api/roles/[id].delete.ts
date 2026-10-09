import { initialRoles } from '~~/server/utils/userManagementStore'
import type { SystemRole } from '~~/server/types/user-management'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const roles = readJSON<SystemRole[]>('roles.json', initialRoles)
  const idx = roles.findIndex((r) => r.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Role not found',
    })
  }

  const removed = roles[idx]
  const remaining = roles.filter((r) => r.id !== id)
  writeJSON('roles.json', remaining)

  return {
    success: true,
    message: 'Role deleted successfully',
    data: removed,
  }
})
