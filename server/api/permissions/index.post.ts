import { writeJSON } from '~~/server/utils/data'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const matrix = (body && typeof body === 'object' && 'matrix' in body) ? body.matrix : body

  if (!matrix || typeof matrix !== 'object' || Object.keys(matrix).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Permissions matrix payload is required',
    })
  }

  writeJSON('permissions.json', matrix)

  return {
    success: true,
    message: 'Permissions saved successfully',
    data: matrix,
  }
})
