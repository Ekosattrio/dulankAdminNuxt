import { deleteRole } from '~~/server/utils/rolesData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role ID is required',
    })
  }

  const removed = deleteRole(id)

  return {
    success: true,
    message: 'Role deleted successfully',
    data: removed,
  }
})
