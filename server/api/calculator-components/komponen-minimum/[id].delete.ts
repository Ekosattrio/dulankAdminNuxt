import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteKomponenMinimumItem } from '#server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID komponen minimum wajib disertakan.'
    })
  }

  const success = deleteKomponenMinimumItem(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Komponen minimum tidak ditemukan.'
    })
  }

  return {
    success: true,
    message: 'Komponen minimum berhasil dihapus'
  }
})

