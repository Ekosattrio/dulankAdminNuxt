import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteJasaLainItem } from '#server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID komponen jasa wajib disertakan.'
    })
  }

  const success = deleteJasaLainItem(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Komponen jasa cetak tidak ditemukan.'
    })
  }

  return {
    success: true,
    message: 'Komponen jasa cetak berhasil dihapus'
  }
})

