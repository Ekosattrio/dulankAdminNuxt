import { defineEventHandler, readBody, createError } from 'h3'
import { saveIncomeCategoryItem } from '#server/utils/incomeCategoriesData'
import type { IncomeCategoryFormData } from '#server/types/income-category'

export default defineEventHandler(async (event) => {
  const body = await readBody<IncomeCategoryFormData>(event)

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama kategori pemasukan wajib diisi.'
    })
  }

  const saved = saveIncomeCategoryItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Kategori pemasukan berhasil diperbarui' : 'Kategori pemasukan baru berhasil ditambahkan'
  }
})

