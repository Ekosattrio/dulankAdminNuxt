import { defineEventHandler, readBody, createError } from 'h3'
import { saveProductProcessItem } from '#server/utils/productProcessesData'
import type { ProductProcessFormData } from '#server/types/product-process'

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductProcessFormData>(event)

  if (!body || !body.productId || !body.processName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Produk dan nama proses wajib diisi.'
    })
  }

  const saved = saveProductProcessItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Product process berhasil diperbarui' : 'Product process baru berhasil ditambahkan'
  }
})

