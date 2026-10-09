import { defineEventHandler, getRouterParam } from 'h3'
import { deletePaperGroup } from '~/server/utils/paperShopData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }

  const success = deletePaperGroup(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Paper group not found'
    })
  }

  return {
    success: true,
    message: 'Paper group deleted successfully'
  }
})

