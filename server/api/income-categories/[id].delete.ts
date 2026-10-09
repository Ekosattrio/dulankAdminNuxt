import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteIncomeCategoryItem } from '#server/utils/incomeCategoriesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID kategori pemasukan wajib disertakan.'
    })
  }

  const success = deleteIncomeCategoryItem(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Kategori pemasukan tidak ditemukan.'
    })
  }

  return {
    success: true,
    message: 'Kategori pemasukan berhasil dihapus'
  }
})

