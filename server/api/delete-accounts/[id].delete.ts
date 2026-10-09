import { initialDeleteRequests } from '~~/server/utils/userManagementStore'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const idx = initialDeleteRequests.findIndex((r) => r.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Request not found',
    })
  }

  const removed = initialDeleteRequests.splice(idx, 1)[0]
  return {
    success: true,
    message: 'Account deletion request processed successfully',
    data: removed,
  }
})
