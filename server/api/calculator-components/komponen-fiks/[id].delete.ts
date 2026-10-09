import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteKomponenFiksItem } from '#server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID komponen fiks wajib disertakan.'
    })
  }

  const success = deleteKomponenFiksItem(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Komponen fiks tidak ditemukan.'
    })
  }

  return {
    success: true,
    message: 'Komponen fiks berhasil dihapus'
  }
})

