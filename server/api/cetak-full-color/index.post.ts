import type { CetakFullColorConfig } from '~/types/cetak-full-color'
import { saveCetakFullColorConfig } from '~/server/utils/cetakFullColor'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CetakFullColorConfig>>(event)
  try {
    const data = saveCetakFullColorConfig(body)
    return {
      success: true,
      data,
      message: 'Cetak full color settings updated successfully',
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Invalid cetak full color configuration',
    })
  }
})
