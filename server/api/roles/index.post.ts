import { initialRoles } from '~~/server/utils/userManagementStore'
import type { SystemRole } from '~~/server/types/user-management'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SystemRole>>(event)

  if (!body?.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role Name is required',
    })
  }

  const roles = readJSON<SystemRole[]>('roles.json', initialRoles)
  const existingIdx = body.id ? roles.findIndex((r) => r.id === body.id) : -1

  if (existingIdx !== -1) {
    roles[existingIdx] = {
      ...roles[existingIdx],
      name: body.name,
      description: body.description !== undefined ? body.description : (roles[existingIdx].description || ''),
    }
    writeJSON('roles.json', roles)
    return {
      success: true,
      message: 'Role updated successfully',
      data: roles[existingIdx],
    }
  } else {
    const today = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
    const newRole: SystemRole = {
      id: body.id || `role-${Date.now()}`,
      name: body.name,
      createdOn: today,
      description: body.description || '',
    }
    roles.unshift(newRole)
    writeJSON('roles.json', roles)
    return {
      success: true,
      message: 'Role created successfully',
      data: newRole,
    }
  }
})
