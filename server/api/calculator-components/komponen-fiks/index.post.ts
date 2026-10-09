import { defineEventHandler, readBody, createError } from 'h3'
import { saveKomponenFiksItem } from '#server/utils/calculatorComponentsData'
import type { KomponenFiksFormData } from '#server/types/calculator-components'

export default defineEventHandler(async (event) => {
  const body = await readBody<KomponenFiksFormData>(event)

  if (!body || !body.name || !body.unit) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama komponen fiks dan satuan wajib diisi.'
    })
  }

  const saved = saveKomponenFiksItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Komponen fiks berhasil diperbarui' : 'Komponen fiks baru berhasil ditambahkan'
  }
})

