import { defineEventHandler, readBody, createError } from 'h3'
import { saveKomponenMinimumItem } from '#server/utils/calculatorComponentsData'
import type { KomponenMinimumFormData } from '#server/types/calculator-components'

export default defineEventHandler(async (event) => {
  const body = await readBody<KomponenMinimumFormData>(event)

  if (!body || !body.name || !body.unit) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama komponen minimum dan unit wajib diisi.'
    })
  }

  const saved = saveKomponenMinimumItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Komponen minimum berhasil diperbarui' : 'Komponen minimum baru berhasil ditambahkan'
  }
})

