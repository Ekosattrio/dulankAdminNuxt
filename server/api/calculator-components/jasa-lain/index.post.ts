import { defineEventHandler, readBody, createError } from 'h3'
import { saveJasaLainItem } from '#server/utils/calculatorComponentsData'
import type { JasaLainFormData } from '#server/types/calculator-components'

export default defineEventHandler(async (event) => {
  const body = await readBody<JasaLainFormData>(event)

  if (!body || !body.name || !body.satuan) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama jasa dan satuan wajib diisi.'
    })
  }

  const saved = saveJasaLainItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Komponen jasa cetak berhasil diperbarui' : 'Komponen jasa cetak baru berhasil ditambahkan'
  }
})

