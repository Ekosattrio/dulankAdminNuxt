import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteUser } from '~~/server/utils/usersData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member ID is required',
    })
  }

  const removed = deleteUser(id)

  return {
    success: true,
    message: 'Member deleted successfully',
    data: removed,
  }
})
