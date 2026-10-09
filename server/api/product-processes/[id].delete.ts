import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteProductProcessItem } from '#server/utils/productProcessesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID product process wajib disertakan.'
    })
  }

  const success = deleteProductProcessItem(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product process tidak ditemukan.'
    })
  }

  return {
    success: true,
    message: 'Product process berhasil dihapus'
  }
})

