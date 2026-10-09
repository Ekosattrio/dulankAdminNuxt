import { defineEventHandler, readBody } from 'h3'
import { savePaperItem } from '~/server/utils/paperShopData'
import type { PaperItemFormData } from '#server/types/paper-shop'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaperItemFormData>(event)

  if (!body?.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Paper item name is required'
    })
  }

  const saved = savePaperItem(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Paper item updated successfully' : 'Paper item created successfully'
  }
})

