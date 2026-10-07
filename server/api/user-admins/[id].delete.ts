import { initialUserAdmins } from '~~/server/utils/userManagementStore'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const idx = initialUserAdmins.findIndex((a) => a.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User Admin not found',
    })
  }

  const removed = initialUserAdmins.splice(idx, 1)[0]
  return {
    success: true,
    message: 'User Admin deleted successfully',
    data: removed,
  }
})
