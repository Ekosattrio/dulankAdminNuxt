import { defineEventHandler, readBody } from 'h3'
import { savePaperGroup } from '~/server/utils/paperShopData'
import type { PaperGroupFormData } from '#server/types/paper-shop'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaperGroupFormData>(event)

  if (!body?.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Paper group name is required'
    })
  }

  const saved = savePaperGroup(body)

  return {
    success: true,
    data: saved,
    message: body.id ? 'Paper group updated successfully' : 'Paper group created successfully'
  }
})

