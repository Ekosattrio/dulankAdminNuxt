import { deleteFaq } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FAQ ID is required'
    })
  }

  const removed = await deleteFaq(id)

  return {
    success: true,
    message: 'FAQ deleted successfully',
    data: removed,
  }
})
