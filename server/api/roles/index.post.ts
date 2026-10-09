import type { SystemRole } from '~~/server/types/user-management'
import { saveRole } from '~~/server/utils/rolesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SystemRole>>(event)

  if (!body?.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role Name is required',
    })
  }

  const { role, isNew } = saveRole(body as Partial<SystemRole> & { name: string })

  return {
    success: true,
    message: isNew ? 'Role created successfully' : 'Role updated successfully',
    data: role,
  }
})
