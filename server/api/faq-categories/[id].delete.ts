import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteFaqCategory } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required',
    })
  }

  const removed = await deleteFaqCategory(id)

  return {
    success: true,
    message: 'FAQ Category deleted successfully',
    data: removed,
  }
})
